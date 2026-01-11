import { handleOptions, json } from '../_utils.js';
import { listProviderStates } from './oidc/_providers.js';
import { getSchoolAuthPolicy, policyAllowsProvider, resolveSchool, sanitizePolicyForPublic } from './oidc/_policy.js';

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  const url = new URL(request.url);
  const schoolSlug = url.searchParams.get('schoolSlug') || url.searchParams.get('school_slug') || '';
  const schoolId = url.searchParams.get('schoolId') || url.searchParams.get('school_id') || '';

  const school = await resolveSchool(env, schoolId, schoolSlug);
  const policy = await getSchoolAuthPolicy(env, school?.id);
  const allowAll = String(env?.OIDC_ALLOW_ALL || '').toLowerCase() === 'true';

  const providers = listProviderStates(env, url.origin).map((provider) => ({
    ...provider,
    allowed: provider.configured && policyAllowsProvider(policy, provider.id, allowAll),
  }));

  return json({
    school_id: school?.id || null,
    school_slug: school?.slug || null,
    providers,
    policy: sanitizePolicyForPublic(policy),
  }, { env });
}
