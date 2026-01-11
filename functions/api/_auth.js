const DEFAULT_DEV_EMAIL = 'dev@breslov.academy';
const DEFAULT_DEV_ROLE = 'admin';

export function getUserFromToken(token, env) {
  if (!token) return null;

  const devToken = env?.DEV_TOKEN || 'dev';
  const devEmail = env?.DEV_EMAIL || DEFAULT_DEV_EMAIL;
  const devRole = env?.DEV_ROLE || DEFAULT_DEV_ROLE;

  if (token === devToken) {
    return {
      id: 'dev-user',
      email: devEmail,
      role: devRole,
    };
  }

  if (token.startsWith('dev:')) {
    const parts = token.split(':');
    const email = parts[1] || devEmail;
    const role = parts[2] || devRole;
    return {
      id: 'dev-user',
      email,
      role,
    };
  }

  return null;
}
