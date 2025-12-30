import React, { useEffect, useMemo, useState } from 'react';
import { FEATURES, getAllRoutes } from '@/components/config/features';
import { useSession } from '@/components/hooks/useSession';
import { isSchoolAdmin } from '@/components/auth/roles';
import PageShell from '@/components/ui/PageShell';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle2, ClipboardCopy, Download, RefreshCw } from 'lucide-react';

/**
 * /integrity (admin-only)
 *
 * Purpose:
 * - Provide a fast, "red flag" diagnostics page for tenancy/security/nav regressions.
 * - Keep checks best-effort: warnings not crashes.
 *
 * NOTE: This page intentionally does not fetch sensitive content.
 * It uses runtime checks + small static scans (source-as-text) for regression patterns.
 */

function safeJson(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return JSON.stringify({ error: 'Could not serialize report' }, null, 2);
  }
}

function iconFor(ok) {
  return ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
}

function statusFor(ok) {
  return ok ? 'good' : 'warn';
}

function scanSchoolSearch(source) {
  const lessonContentLeak = /scoped(Filter|List)\(\s*['"]Lesson['"][\s\S]*?\{[\s\S]*?\b(content|body)\b/m.test(source)
    || /entities\.Lesson\.filter\(\{[\s\S]*?\b(content|body)\b/m.test(source);
  const lessonLimitPresent = /scoped(Filter|List)\(\s*['"]Lesson['"][\s\S]*?,\s*(\d+)\s*\)/m.test(source)
    || /entities\.Lesson\.filter\([\s\S]*?,\s*(\d+)\s*\)/m.test(source);
  return {
    key: 'scan_school_search',
    label: 'Search leakage scan (SchoolSearch)',
    ok: !lessonContentLeak && lessonLimitPresent,
    detail: [
      lessonContentLeak ? '❌ SchoolSearch appears to filter lessons by content/body (paid text leakage risk).' : '✅ No lesson content/body filter detected.',
      lessonLimitPresent ? '✅ Lesson query includes an explicit limit.' : '⚠️ Lesson query missing explicit limit (performance risk).'
    ]
  };
}

function scanDownloads(source) {
  const fileUrlReferenced = /\bfile_url\b/.test(source);
  return {
    key: 'scan_downloads',
    label: 'Download URL exposure scan (Downloads)',
    ok: !fileUrlReferenced,
    detail: [
      !fileUrlReferenced
        ? '✅ No direct file_url references detected (should be retrieved via getSecureDownloadUrl).'
        : '⚠️ file_url appears in Downloads page source. Verify it is NOT rendered/exposed before auth checks.'
    ]
  };
}

function scanReader(source) {
  // Reader must NOT fetch all protected texts. We expect an entitlement-gated $or filter.
  const hasEntitlementGate = /\$or\s*:\s*\[/.test(source) && /\$in/.test(source) && /allowedCourseIds/.test(source);
  const textLimitPresent = /scopedFilter\('Text'[\s\S]*?,\s*50\)/m.test(source);
  return {
    key: 'scan_reader',
    label: 'Reader text fetch scan (Reader)',
    ok: hasEntitlementGate && textLimitPresent,
    detail: [
      hasEntitlementGate
        ? '✅ Reader appears to gate Text retrieval by entitlements ($or + $in).' 
        : '⚠️ Reader may fetch protected texts without entitlement gating. Gate at query-time to avoid client-side leakage.',
      textLimitPresent ? '✅ Reader uses explicit limit for Text queries.' : '⚠️ Reader Text query missing explicit limit.'
    ]
  };
}

function scanScoped(source) {
  const hasDownloadScoped = /['"]Download['"]/.test(source);
  const hasBundleScoped = /['"]Bundle['"]/.test(source);
  const hasAnalyticsScoped = /['"]AnalyticsEvent['"]/.test(source);
  return {
    key: 'scan_scoped',
    label: 'Tenancy scope list scan (scoped module)',
    ok: hasDownloadScoped && hasBundleScoped && hasAnalyticsScoped,
    detail: [
      hasDownloadScoped ? '✅ Download is in SCHOOL_SCOPED_ENTITIES.' : '⚠️ Download missing from SCHOOL_SCOPED_ENTITIES (tenant leakage risk).',
      hasBundleScoped ? '✅ Bundle is in SCHOOL_SCOPED_ENTITIES.' : '⚠️ Bundle missing from SCHOOL_SCOPED_ENTITIES.',
      hasAnalyticsScoped ? '✅ AnalyticsEvent is in SCHOOL_SCOPED_ENTITIES.' : '⚠️ AnalyticsEvent missing from SCHOOL_SCOPED_ENTITIES.'
    ]
  };
}

export default function Integrity() {
  const session = useSession();
  const { user, role, activeSchoolId, isLoading } = session;

  const [sources, setSources] = useState(null);
  const [reloading, setReloading] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);

  const canView = !!user && isSchoolAdmin(role);

  useEffect(() => {
    if (!canView) return;
    let alive = true;

    const loadSources = async () => {
      try {
        setReloading(true);
        const [schoolSearch, downloads, reader, scoped] = await Promise.all([
          import('./SchoolSearch.jsx?raw'),
          import('./Downloads.jsx?raw'),
          import('./Reader.jsx?raw'),
          import('../components/api/scoped.jsx?raw')
        ]);
        if (!alive) return;
        setSources({
          schoolSearch: schoolSearch.default,
          downloads: downloads.default,
          reader: reader.default,
          scoped: scoped.default
        });
      } catch (e) {
        console.warn('Integrity scans: failed to load source modules', e);
        if (!alive) return;
        setSources({ error: String(e) });
      } finally {
        if (alive) setReloading(false);
      }
    };

    loadSources();
    return () => {
      alive = false;
    };
  }, [canView, reloadNonce]);

  const registryStats = useMemo(() => {
    const featureCount = Object.keys(FEATURES || {}).length;
    const routes = getAllRoutes();
    const duplicates = routes.filter((r, idx) => routes.indexOf(r) !== idx);
    return {
      featureCount,
      routeCount: routes.length,
      duplicates: Array.from(new Set(duplicates))
    };
  }, []);

  const scans = useMemo(() => {
    if (!sources || sources.error) return [];
    return [
      scanSchoolSearch(sources.schoolSearch),
      scanDownloads(sources.downloads),
      scanReader(sources.reader),
      scanScoped(sources.scoped)
    ];
  }, [sources]);

  const coreChecks = useMemo(() => {
    // IMPORTANT: Keep these checks lightweight and non-invasive.
    const hasRegistry = !!FEATURES && Object.keys(FEATURES).length > 30;
    const hasActiveSchool = !!activeSchoolId;
    const hasVault = Object.values(FEATURES).some((f) => f?.key === 'Vault');
    const hasIntegrity = Object.values(FEATURES).some((f) => f?.key === 'Integrity');

    return [
      {
        key: 'registry_present',
        label: 'Feature Registry loaded',
        ok: hasRegistry,
        detail: [`FEATURES count: ${Object.keys(FEATURES || {}).length}`]
      },
      {
        key: 'vault_registered',
        label: 'Vault registered',
        ok: hasVault,
        detail: [hasVault ? '✅ Vault is present in registry.' : '❌ Vault missing from registry.']
      },
      {
        key: 'integrity_registered',
        label: 'Integrity registered',
        ok: hasIntegrity,
        detail: [hasIntegrity ? '✅ Integrity is present in registry.' : '❌ Integrity missing from registry.']
      },
      {
        key: 'active_school',
        label: 'Active school selected',
        ok: hasActiveSchool,
        detail: [hasActiveSchool ? `activeSchoolId: ${activeSchoolId}` : '⚠️ No activeSchoolId found. Some scoped pages may fail.']
      },
      {
        key: 'routes_deduped',
        label: 'No duplicate routes in registry',
        ok: registryStats.duplicates.length === 0,
        detail: registryStats.duplicates.length === 0 ? ['✅ No duplicate registry routes found.'] : registryStats.duplicates.map((r) => `⚠️ Duplicate route: ${r}`)
      }
    ];
  }, [activeSchoolId, registryStats]);

  const report = useMemo(() => {
    const now = new Date().toISOString();
    const sections = {
      meta: {
        generated_at: now,
        user_email: user?.email || null,
        role: role || null,
        active_school_id: activeSchoolId || null
      },
      registry: registryStats,
      checks: Object.fromEntries(coreChecks.map((c) => [c.key, c.ok])),
      scans: Object.fromEntries(scans.map((s) => [s.key, s.ok]))
    };
    return sections;
  }, [user?.email, role, activeSchoolId, registryStats, coreChecks, scans]);

  const overallOk = useMemo(() => {
    const all = [...coreChecks, ...scans];
    if (all.length === 0) return false;
    return all.every((c) => c.ok);
  }, [coreChecks, scans]);

  const copyReport = async () => {
    const text = safeJson(report);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback: open in a new window
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    }
  };

  const downloadReport = () => {
    const text = safeJson(report);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integrity-report-${new Date().toISOString().slice(0, 19).replaceAll(':', '-')}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  };

  if (isLoading) {
    return (
      <PageShell title="Integrity" subtitle="Loading session…">
        <GlassCard>
          <div className="p-6 text-sm text-slate-600">Loading…</div>
        </GlassCard>
      </PageShell>
    );
  }

  if (!canView) {
    return (
      <PageShell title="Integrity" subtitle="Admin-only diagnostics">
        <GlassCard>
          <EmptyState
            icon={AlertTriangle}
            title="Access denied"
            description="This page is restricted to school admins."
          />
        </GlassCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Integrity"
      subtitle="Best-effort diagnostics for registry, routes, tenancy and content-protection regressions."
      actions={
        <>
          <Button variant="outline" onClick={copyReport}>
            <ClipboardCopy className="mr-2 h-4 w-4" /> Copy JSON
          </Button>
          <Button variant="outline" onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button
            onClick={() => {
              // Re-trigger scan load
              setSources(null);
              setReloadNonce((n) => n + 1);
            }}
            variant="secondary"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-2">
          <SectionHeader
            title="System status"
            description="These checks are intentionally conservative. Any warning should be investigated before deploying."
            right={<StatusBadge variant={overallOk ? 'good' : 'warn'}>{overallOk ? 'Healthy' : 'Needs attention'}</StatusBadge>}
          />

          <div className="mt-4 space-y-3">
            {[...coreChecks, ...scans].map((c) => (
              <div key={c.key} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={c.ok ? 'text-emerald-300' : 'text-amber-300'}>{iconFor(c.ok)}</span>
                      <div className="font-medium text-slate-100">{c.label}</div>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-slate-300">
                      {(c.detail || []).map((d, idx) => (
                        <div key={idx}>{d}</div>
                      ))}
                    </div>
                  </div>
                  <StatusBadge variant={statusFor(c.ok)}>{c.ok ? 'OK' : 'WARN'}</StatusBadge>
                </div>
              </div>
            ))}
          </div>

          {sources?.error && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
              Source scan loading error: {sources.error}
            </div>
          )}

          {reloading && !sources && (
            <div className="mt-4 text-sm text-slate-400">Loading source scans…</div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <SectionHeader title="Registry" description="Quick registry stats." />
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span>Features</span><span className="text-slate-100">{registryStats.featureCount}</span></div>
            <div className="flex items-center justify-between"><span>Routes</span><span className="text-slate-100">{registryStats.routeCount}</span></div>
          </div>
          <Separator className="my-4" />
          <div className="text-sm text-slate-300">
            <div className="font-medium text-slate-100">Guidance</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Never inline the feature registry into Vault.</li>
              <li>All school-owned queries must be scoped to activeSchoolId.</li>
              <li>Do not expose lesson text, video or download URLs in LOCKED states.</li>
              <li>When in doubt, validate /integrity before shipping.</li>
            </ul>
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
