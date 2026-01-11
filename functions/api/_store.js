import { normalizeLimit } from './_utils.js';

const DEFAULT_LIMIT = 50;
const MEMORY_STORE = new Map();

function getMemoryBucket(entity) {
  if (!MEMORY_STORE.has(entity)) {
    MEMORY_STORE.set(entity, new Map());
  }
  return MEMORY_STORE.get(entity);
}

function ensureDb(env) {
  return env?.DB || null;
}

function safeParseJson(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeFields(fields) {
  if (!fields) return null;
  if (Array.isArray(fields)) {
    return fields.map((v) => String(v)).filter(Boolean);
  }
  if (typeof fields === 'string') {
    return fields.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return null;
}

function applyPreviewChars(record, previewChars) {
  if (!previewChars || !record || typeof record !== 'object') return record;
  const next = { ...record };
  const max = Number(previewChars);
  if (!Number.isFinite(max) || max <= 0) return next;

  ['content', 'content_text', 'text', 'body'].forEach((key) => {
    if (typeof next[key] === 'string' && next[key].length > max) {
      next[key] = next[key].slice(0, max) + '...';
    }
  });
  return next;
}

function projectRecord(record, fields, previewChars) {
  if (!record || typeof record !== 'object') return record;
  const projected = applyPreviewChars(record, previewChars);
  const normalized = normalizeFields(fields);
  if (!normalized || normalized.length === 0) return projected;

  const allow = new Set(normalized.map((f) => String(f)));
  allow.add('id');
  if (record.school_id) allow.add('school_id');
  if (record.user_email) allow.add('user_email');

  const out = {};
  allow.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(projected, key)) {
      out[key] = projected[key];
    }
  });
  return out;
}

function matchesFilters(record, filters, ignoredKeys) {
  if (filters && typeof filters === 'object' && Array.isArray(filters.$or)) {
    const orMatched = filters.$or.some((clause) => matchesFilters(record, clause, ignoredKeys));
    if (!orMatched) return false;
  }

  const entries = Object.entries(filters || {}).filter(([key, value]) => {
    if (ignoredKeys.includes(key)) return false;
    if (key === '$or') return false;
    return value !== undefined && value !== null;
  });

  if (entries.length === 0) return true;

  return entries.every(([key, expected]) => {
    const actual = record?.[key];
    if (Array.isArray(expected)) {
      return expected.includes(actual);
    }
    if (expected && typeof expected === 'object') {
      if (Object.prototype.hasOwnProperty.call(expected, '$in')) {
        const list = Array.isArray(expected.$in) ? expected.$in : [];
        if (Array.isArray(actual)) {
          return actual.some((item) => list.includes(item));
        }
        return list.includes(actual);
      }
      if (Object.prototype.hasOwnProperty.call(expected, '$ne')) {
        return actual !== expected.$ne;
      }
      if (Object.prototype.hasOwnProperty.call(expected, '$eq')) {
        return actual === expected.$eq;
      }
      if (Object.prototype.hasOwnProperty.call(expected, 'value')) {
        return actual === expected.value;
      }
      return actual === expected;
    }
    return actual === expected;
  });
}

function sortRecords(records, sort) {
  if (!sort) return records;
  const raw = String(sort);
  const desc = raw.startsWith('-');
  const key = desc ? raw.slice(1) : raw;
  const sortKey = key || 'created_date';

  return [...records].sort((a, b) => {
    const aVal = a?.[sortKey];
    const bVal = b?.[sortKey];
    if (aVal === bVal) return 0;
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;
    if (aVal > bVal) return desc ? -1 : 1;
    if (aVal < bVal) return desc ? 1 : -1;
    return 0;
  });
}

function enrichRecord(data, fallback) {
  if (!data || typeof data !== 'object') {
    return fallback || null;
  }
  if (!data.id && fallback?.id) {
    data.id = fallback.id;
  }
  return data;
}

export async function listEntities(env, entity, options = {}) {
  const db = ensureDb(env);
  if (!db) {
    return listEntitiesMemory(entity, options);
  }
  const filters = options.filters && typeof options.filters === 'object' ? options.filters : {};
  const limit = normalizeLimit(options.limit, DEFAULT_LIMIT);
  const bindings = [entity];

  let sql = 'SELECT id, data FROM entities WHERE entity = ?';

  if (filters.id) {
    sql += ' AND id = ?';
    bindings.push(String(filters.id));
  }
  if (filters.school_id) {
    sql += ' AND school_id = ?';
    bindings.push(String(filters.school_id));
  }
  if (filters.user_email) {
    sql += ' AND user_email = ?';
    bindings.push(String(filters.user_email));
  }

  sql += ' LIMIT ?';
  bindings.push(limit);

  const result = await db.prepare(sql).bind(...bindings).all();
  const rows = result?.results || [];

  const ignoredKeys = ['id', 'school_id', 'user_email'];
  const records = rows.map((row) => enrichRecord(safeParseJson(row.data), row));
  const filtered = records.filter((record) => matchesFilters(record, filters, ignoredKeys));
  const sorted = sortRecords(filtered, options.sort);
  if (!options.fields && !options.previewChars) return sorted;
  return sorted.map((record) => projectRecord(record, options.fields, options.previewChars));
}

export async function createEntity(env, entity, payload = {}) {
  const db = ensureDb(env);
  const now = new Date().toISOString();
  const id = payload.id ? String(payload.id) : crypto.randomUUID();

  const record = {
    ...payload,
    id,
    created_date: payload.created_date || now,
    updated_date: now,
  };

  if (!db) {
    const bucket = getMemoryBucket(entity);
    bucket.set(id, record);
    return record;
  }

  await db.prepare(
    'INSERT INTO entities (id, entity, school_id, user_email, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    id,
    entity,
    record.school_id ? String(record.school_id) : null,
    record.user_email ? String(record.user_email) : null,
    JSON.stringify(record),
    Date.parse(record.created_date) || Date.now(),
    Date.parse(record.updated_date) || Date.now(),
  ).run();

  return record;
}

export async function updateEntity(env, entity, id, payload = {}) {
  const db = ensureDb(env);

  if (!db) {
    return updateEntityMemory(entity, id, payload);
  }

  const existing = await db.prepare(
    'SELECT data FROM entities WHERE entity = ? AND id = ? LIMIT 1'
  ).bind(entity, String(id)).first();

  if (!existing?.data) {
    return null;
  }

  const current = safeParseJson(existing.data) || {};
  const now = new Date().toISOString();

  const updated = {
    ...current,
    ...payload,
    id: String(id),
    created_date: current.created_date || now,
    updated_date: now,
  };

  await db.prepare(
    'UPDATE entities SET data = ?, school_id = ?, user_email = ?, updated_at = ? WHERE entity = ? AND id = ?'
  ).bind(
    JSON.stringify(updated),
    updated.school_id ? String(updated.school_id) : null,
    updated.user_email ? String(updated.user_email) : null,
    Date.parse(updated.updated_date) || Date.now(),
    entity,
    String(id),
  ).run();

  return updated;
}

export async function deleteEntity(env, entity, id) {
  const db = ensureDb(env);
  if (!db) {
    return deleteEntityMemory(entity, id);
  }
  const result = await db.prepare(
    'DELETE FROM entities WHERE entity = ? AND id = ?'
  ).bind(entity, String(id)).run();

  return result?.success === true || result?.meta?.changes > 0;
}

function listEntitiesMemory(entity, options = {}) {
  const filters = options.filters && typeof options.filters === 'object' ? options.filters : {};
  const ignoredKeys = ['id', 'school_id', 'user_email'];
  const bucket = getMemoryBucket(entity);
  const rows = Array.from(bucket.values());
  const filtered = rows.filter((record) => matchesFilters(record, filters, ignoredKeys));
  const sorted = sortRecords(filtered, options.sort);
  const limit = normalizeLimit(options.limit, DEFAULT_LIMIT);
  const sliced = sorted.slice(0, limit);
  if (!options.fields && !options.previewChars) return sliced;
  return sliced.map((record) => projectRecord(record, options.fields, options.previewChars));
}

function updateEntityMemory(entity, id, payload = {}) {
  const bucket = getMemoryBucket(entity);
  if (!bucket.has(id)) return null;
  const current = bucket.get(id) || {};
  const now = new Date().toISOString();
  const updated = {
    ...current,
    ...payload,
    id: String(id),
    created_date: current.created_date || now,
    updated_date: now,
  };
  bucket.set(id, updated);
  return updated;
}

function deleteEntityMemory(entity, id) {
  const bucket = getMemoryBucket(entity);
  return bucket.delete(String(id));
}
