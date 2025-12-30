/**
 * Base44 route helper.
 *
 * Legacy compatibility:
 * - Historically Base44 projects used /PageName URLs.
 * - This app now also has canonical, human URLs (lowercase) for key areas.
 *
 * This function keeps deep links working while preferring canonical paths
 * from the Feature Registry when available.
 */
import { FEATURES } from '@/components/config/features';

export function createPageUrl(pageName: string, params: Record<string, any> = {}) {
    if (!pageName) return '/';
    // If caller passes a path already, respect it.
    if (pageName.startsWith('/')) {
        return appendQuery(pageName, params);
    }

    // Try registry-based canonical routing first.
    try {
        const list = FEATURES ? (Object.values(FEATURES) as any[]) : [];
        const wanted = String(pageName).toLowerCase();
        const match = list.find((f) => {
            const k = String(f?.key || '').toLowerCase();
            const label = String(f?.label || '').toLowerCase();
            return k === wanted || label === wanted;
        });
        if (match?.route) {
            return appendQuery(String(match.route), params);
        }
    } catch {
        // ignore – fallback below
    }

    // Fallback: legacy /PageName convention
    const legacy = '/' + pageName.replace(/ /g, '-');
    return appendQuery(legacy, params);
}

function appendQuery(path: string, params: Record<string, any>) {
    const entries = Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '');
    if (entries.length === 0) return path;
    const qs = new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
    return path.includes('?') ? `${path}&${qs}` : `${path}?${qs}`;
}