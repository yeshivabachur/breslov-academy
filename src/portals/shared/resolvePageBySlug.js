import Pages from './portalPages';

const normalizeKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Resolves a URL slug (e.g. "dashboard", "my-quizzes") to a React component.
 * Uses case-insensitive matching against keys in pages.config.js.
 */
export function resolvePageBySlug(pageSlug) {
  if (!pageSlug) return null;

  // 1. Exact match
  if (Pages[pageSlug]) return Pages[pageSlug];

  // 2. Case-insensitive + normalized match
  const normalized = normalizeKey(pageSlug);
  const keys = Object.keys(Pages);
  const found = keys.find((k) => normalizeKey(k) === normalized);

  if (found) return Pages[found];

  return null;
}

export function resolvePageKeyBySlug(pageSlug) {
  if (!pageSlug) return null;
  if (Pages[pageSlug]) return pageSlug;

  const normalized = normalizeKey(pageSlug);
  const keys = Object.keys(Pages);
  const found = keys.find((k) => normalizeKey(k) === normalized);
  return found || null;
}
