import { errorResponse, getBearerToken, handleOptions, json, normalizeLimit, parseQueryJson, readJson } from '../_utils.js';
import { createEntity, listEntities } from '../_store.js';
import { getUserFromToken } from '../_auth.js';
import { applyFieldProjection, applyLessonAccess, applyQuizQuestionAccess } from '../_access.js';
import {
  applyPublicRule,
  canWriteUnauth,
  findSchoolByFilter,
  getPublicRule,
  hasInviteForUser,
  hasMembership,
  isGlobalAdmin,
  isGlobalEntity,
  isPublicTokenLookup,
  isSchoolPublic,
  isSelfScoped,
  isUserScopedGlobal,
  requiresSchoolScope,
  sanitizePublicFields,
  sanitizePublicPreviewChars,
} from '../_tenancy.js';

async function hasAdminRole(env, schoolId, email) {
  if (!schoolId || !email) return false;
  const rows = await listEntities(env, 'SchoolMembership', {
    filters: { school_id: String(schoolId), user_email: String(email) },
    limit: 1,
  });
  const role = String(rows?.[0]?.role || '').toUpperCase();
  return ['OWNER', 'ADMIN', 'SUPERADMIN'].includes(role);
}

function normalizePreviewChars(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.min(Math.floor(parsed), 20000);
}

function normalizeFields(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return raw.map((v) => String(v)).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return null;
}

export async function onRequest({ request, env, params }) {
  const options = handleOptions(request, env);
  if (options) return options;

  const entity = params?.entity ? String(params.entity) : null;
  if (!entity) {
    return errorResponse('missing_entity', 400, 'Missing entity name', env);
  }
  const token = getBearerToken(request);
  const user = await getUserFromToken(token, env);
  const isAuthenticated = Boolean(user?.email);
  const globalAdmin = isGlobalAdmin(user, env);

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const filters = parseQueryJson(url.searchParams.get('filter')) || {};
    const sort = url.searchParams.get('sort') || null;
    const limit = normalizeLimit(url.searchParams.get('limit'));
    const fieldsRaw = parseQueryJson(url.searchParams.get('fields')) || url.searchParams.get('fields');
    const fields = normalizeFields(fieldsRaw);
    const previewChars = normalizePreviewChars(url.searchParams.get('previewChars'));
    const publicRule = getPublicRule(entity);
    const publicFilters = publicRule ? applyPublicRule(entity, filters) : null;
    const requiresAccessGate = entity === 'Lesson' || entity === 'QuizQuestion';

    if (!isAuthenticated) {
      if (isPublicTokenLookup(entity, filters)) {
      try {
        const rows = await listEntities(env, entity, { filters, sort, limit, fields, previewChars });
        return json(rows, { env });
      } catch (err) {
        return errorResponse('storage_unavailable', 503, err.message, env);
      }
    }
      if (!publicRule || !publicFilters) {
        return errorResponse('auth_required', 401, 'Authentication required', env);
      }
      if (publicRule.requiresSchoolId && !publicFilters.school_id) {
        return errorResponse('missing_school', 400, 'school_id is required', env);
      }
      if (requiresSchoolScope(entity) && publicRule.requiresSchoolId) {
        const schoolOk = await isSchoolPublic(env, publicFilters.school_id);
        if (!schoolOk) {
          return errorResponse('forbidden', 403, 'School is not public', env);
        }
      }
      const safeFields = sanitizePublicFields(entity, fields);
      const safePreview = sanitizePublicPreviewChars(entity, previewChars);
      try {
        const rows = await listEntities(env, entity, { filters: publicFilters, sort, limit, fields: safeFields, previewChars: safePreview });
        return json(rows, { env });
      } catch (err) {
        return errorResponse('storage_unavailable', 503, err.message, env);
      }
    }

    if (entity === 'School') {
      if (globalAdmin) {
        try {
          const rows = await listEntities(env, entity, { filters, sort, limit, fields, previewChars });
          return json(rows, { env });
        } catch (err) {
          return errorResponse('storage_unavailable', 503, err.message, env);
        }
      }

      if (filters?.is_public === true) {
        const safeFields = sanitizePublicFields(entity, fields);
        try {
          const rows = await listEntities(env, entity, { filters: publicFilters || filters, sort, limit, fields: safeFields, previewChars });
          return json(rows, { env });
        } catch (err) {
          return errorResponse('storage_unavailable', 503, err.message, env);
        }
      }

      const school = await findSchoolByFilter(env, filters);
      if (!school) {
        return json([], { env });
      }

      const isMember = await hasMembership(env, school.id, user.email);
      if (isMember) {
        return json([school], { env });
      }

      const invited = await hasInviteForUser(env, school.id, user.email);
      if (invited) {
        return json([school], { env });
      }

      if (school.is_public) {
        const safeFields = sanitizePublicFields(entity, fields);
        return json([school].map((row) => {
          if (!safeFields || safeFields.length === 0) return row;
          const allow = new Set(safeFields.concat(['id']));
          const out = {};
          Object.entries(row).forEach(([key, value]) => {
            if (allow.has(key)) out[key] = value;
          });
          return out;
        }), { env });
      }

      return errorResponse('forbidden', 403, 'Not authorized to access this school', env);
    }

    if (requiresSchoolScope(entity)) {
      const schoolId = filters?.school_id ? String(filters.school_id) : null;
      const selfScoped = isSelfScoped(entity, filters, user.email);

      if (!schoolId && !selfScoped) {
        return errorResponse('missing_school', 400, 'school_id is required', env);
      }

      if (schoolId && !globalAdmin) {
        const isMember = await hasMembership(env, schoolId, user.email);
        if (entity === 'DomainVerification') {
          const isAdmin = await hasAdminRole(env, schoolId, user.email);
          if (!isAdmin) {
            return errorResponse('forbidden', 403, 'Admin role required', env);
          }
        }
        if (!isMember && publicRule && publicFilters) {
          const schoolOk = await isSchoolPublic(env, schoolId);
          if (!schoolOk) {
            return errorResponse('forbidden', 403, 'Not authorized for this school', env);
          }
          const safeFields = sanitizePublicFields(entity, fields);
          const safePreview = sanitizePublicPreviewChars(entity, previewChars);
        try {
          const rows = await listEntities(env, entity, { filters: publicFilters, sort, limit, fields: safeFields, previewChars: safePreview });
          return json(rows, { env });
        } catch (err) {
          return errorResponse('storage_unavailable', 503, err.message, env);
        }
      }
        if (!isMember) {
          return errorResponse('forbidden', 403, 'Not authorized for this school', env);
        }
      }
    } else if (isGlobalEntity(entity)) {
      if (!globalAdmin && !isUserScopedGlobal(entity, filters, user.email)) {
        return errorResponse('forbidden', 403, 'Not authorized', env);
      }
    }

    const rawFields = fields;
    const rawPreview = previewChars;
    const shouldGate = requiresAccessGate && !globalAdmin;
    const listFields = shouldGate ? null : rawFields;
    const listPreviewChars = shouldGate ? null : rawPreview;

    try {
      let rows = await listEntities(env, entity, { filters, sort, limit, fields: listFields, previewChars: listPreviewChars });
      if (shouldGate) {
        if (entity === 'Lesson') {
          rows = await applyLessonAccess({
            env,
            schoolId: filters?.school_id,
            userEmail: user.email,
            lessons: rows,
            previewChars: rawPreview,
          });
        }
        if (entity === 'QuizQuestion') {
          rows = await applyQuizQuestionAccess({
            env,
            schoolId: filters?.school_id,
            userEmail: user.email,
            questions: rows,
          });
        }
        rows = applyFieldProjection(rows, rawFields);
      }
      return json(rows, { env });
    } catch (err) {
      return errorResponse('storage_unavailable', 503, err.message, env);
    }
  }

  if (request.method === 'POST') {
    const payload = await readJson(request);
    if (!payload) {
      return errorResponse('invalid_payload', 400, 'Expected JSON body', env);
    }
    if (!isAuthenticated && !canWriteUnauth(entity, request.method)) {
      return errorResponse('auth_required', 401, 'Authentication required', env);
    }
    if (requiresSchoolScope(entity)) {
      const schoolId = payload.school_id ? String(payload.school_id) : null;
      if (!schoolId) {
        return errorResponse('missing_school', 400, 'school_id is required', env);
      }
      if (!globalAdmin) {
        if (entity === 'DomainVerification') {
          const isAdmin = await hasAdminRole(env, schoolId, user.email);
          if (!isAdmin) {
            return errorResponse('forbidden', 403, 'Admin role required', env);
          }
        }
        if (entity === 'SchoolMembership') {
          const payloadEmail = payload.user_email || payload.userEmail || '';
          if (payloadEmail && String(payloadEmail).toLowerCase() !== String(user.email).toLowerCase()) {
            return errorResponse('forbidden', 403, 'Cannot create membership for another user', env);
          }
        }
        const isMember = await hasMembership(env, schoolId, user.email);
        const invited = entity === 'SchoolMembership'
          ? await hasInviteForUser(env, schoolId, user.email)
          : false;
        if (!isMember && !invited) {
          return errorResponse('forbidden', 403, 'Not authorized for this school', env);
        }
      }
    } else if (isGlobalEntity(entity) && !canWriteUnauth(entity, request.method)) {
      if (!globalAdmin && !isUserScopedGlobal(entity, payload, user.email)) {
        return errorResponse('forbidden', 403, 'Not authorized', env);
      }
    }
    try {
      const created = await createEntity(env, entity, payload);
      return json(created, { status: 201, env });
    } catch (err) {
      return errorResponse('storage_unavailable', 503, err.message, env);
    }
  }

  return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
}
