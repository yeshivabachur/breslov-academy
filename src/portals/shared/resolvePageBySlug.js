import Pages from './portalPages';

/**
 * Resolves a URL slug (e.g. "dashboard", "my-quizzes") to a React component.
 * Uses case-insensitive matching against keys in pages.config.js.
 */
export function resolvePageBySlug(pageSlug) {
  if (!pageSlug) return null;

  // 1. Exact match
  if (Pages[pageSlug]) return Pages[pageSlug];

  // 2. Case-insensitive match
  const lower = pageSlug.toLowerCase();
  const keys = Object.keys(Pages);
  const found = keys.find((k) => k.toLowerCase() === lower);

  if (found) return Pages[found];

  return null;
}
