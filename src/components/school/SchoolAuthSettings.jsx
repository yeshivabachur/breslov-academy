import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { scopedCreate, scopedFilter, scopedUpdate } from '@/components/api/scoped';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useSession } from '@/components/hooks/useSession';

const PROVIDERS = [
  { id: 'google', label: 'Google Workspace' },
  { id: 'microsoft', label: 'Microsoft 365' },
];

const ROLE_OPTIONS = ['STUDENT', 'INSTRUCTOR', 'TEACHER', 'TA', 'ADMIN'];

function normalizeDomains(raw) {
  if (!raw) return [];
  return raw
    .split(/[\n,]+/)
    .map((value) => value.trim().replace(/^@/, '').toLowerCase())
    .filter(Boolean);
}

function formatDomains(domains) {
  if (!Array.isArray(domains)) return '';
  return domains.join(', ');
}

export default function SchoolAuthSettings({ schoolId }) {
  const { user } = useSession();
  const [form, setForm] = useState({
    ssoEnabled: false,
    allowedProviders: PROVIDERS.map((provider) => provider.id),
    allowedDomains: '',
    requireDomainMatch: true,
    requireDomainVerification: false,
    allowPersonalEmails: false,
    autoProvision: false,
    autoProvisionRole: 'STUDENT',
    domainRoleMap: {},
  });
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { data: policyRows = [], isLoading: isPolicyLoading } = useQuery({
    queryKey: ['school-auth-policy', schoolId],
    queryFn: () => scopedFilter('SchoolAuthPolicy', schoolId, {}, '-created_date', 1),
    enabled: !!schoolId,
  });

  const policy = policyRows?.[0] || null;

  const { data: providerStatus } = useQuery({
    queryKey: ['auth-provider-status', schoolId],
    queryFn: () => base44.request('/auth/providers', {
      params: schoolId ? { schoolId } : undefined,
    }),
    enabled: !!schoolId,
  });

  const { data: domainVerifications = [], refetch: refetchDomainVerifications } = useQuery({
    queryKey: ['domain-verifications', schoolId],
    queryFn: () => scopedFilter('DomainVerification', schoolId, {}, '-requested_at', 50),
    enabled: !!schoolId,
  });

  useEffect(() => {
    if (!policy) return;
    setForm({
      ssoEnabled: policy.sso_enabled !== false,
      allowedProviders: Array.isArray(policy.allowed_providers) && policy.allowed_providers.length > 0
        ? policy.allowed_providers
        : PROVIDERS.map((provider) => provider.id),
      allowedDomains: formatDomains(policy.allowed_domains),
      requireDomainMatch: policy.require_domain_match === true,
      requireDomainVerification: policy.require_domain_verification === true,
      allowPersonalEmails: policy.allow_personal_emails !== false,
      autoProvision: policy.auto_provision === true,
      autoProvisionRole: policy.auto_provision_role || policy.default_role || 'STUDENT',
      domainRoleMap: policy.domain_role_map || {},
    });
  }, [policy]);

  const configuredProviders = useMemo(() => {
    const list = providerStatus?.providers || [];
    return list.reduce((acc, provider) => {
      acc[provider.id] = provider.configured;
      return acc;
    }, {});
  }, [providerStatus]);

  const allowedDomains = useMemo(() => normalizeDomains(form.allowedDomains), [form.allowedDomains]);

  const verificationByDomain = useMemo(() => {
    const map = new Map();
    (domainVerifications || []).forEach((row) => {
      if (row?.domain) map.set(String(row.domain).toLowerCase(), row);
    });
    return map;
  }, [domainVerifications]);

  useEffect(() => {
    if (!allowedDomains.length) return;
    setForm((prev) => {
      const nextMap = { ...(prev.domainRoleMap || {}) };
      let changed = false;
      allowedDomains.forEach((domain) => {
        if (!nextMap[domain]) {
          nextMap[domain] = prev.autoProvisionRole || 'STUDENT';
          changed = true;
        }
      });
      Object.keys(nextMap).forEach((domain) => {
        if (!allowedDomains.includes(domain)) {
          delete nextMap[domain];
          changed = true;
        }
      });
      if (!changed) return prev;
      return { ...prev, domainRoleMap: nextMap };
    });
  }, [allowedDomains.join(','), form.autoProvisionRole]);

  const updateProvider = (providerId) => {
    setForm((prev) => {
      const exists = prev.allowedProviders.includes(providerId);
      const nextProviders = exists
        ? prev.allowedProviders.filter((id) => id !== providerId)
        : [...prev.allowedProviders, providerId];
      return { ...prev, allowedProviders: nextProviders };
    });
  };

  const handleChallengeDomain = async (domain, force = false) => {
    if (!schoolId || !domain) return;
    try {
      const result = await base44.request('/auth/domain/challenge', {
        method: 'POST',
        body: { school_id: schoolId, domain, force },
      });
      setActiveChallenge(result);
      await refetchDomainVerifications();
      toast.success('Verification record created');
    } catch (error) {
      toast.error('Unable to create verification record');
    }
  };

  const handleVerifyDomain = async (domain) => {
    if (!schoolId || !domain) return;
    setIsVerifying(true);
    try {
      const result = await base44.request('/auth/domain/verify', {
        method: 'POST',
        body: { school_id: schoolId, domain },
      });
      await refetchDomainVerifications();
      setActiveChallenge(result?.verified ? null : activeChallenge);
      toast.success(result?.verified ? 'Domain verified' : 'Domain not verified yet');
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = async () => {
    if (!schoolId) return;
    const payload = {
      sso_enabled: form.ssoEnabled,
      allowed_providers: form.allowedProviders,
      allowed_domains: normalizeDomains(form.allowedDomains),
      require_domain_match: form.requireDomainMatch,
      require_domain_verification: form.requireDomainVerification,
      allow_personal_emails: form.allowPersonalEmails,
      auto_provision: form.autoProvision,
      auto_provision_role: form.autoProvisionRole,
      domain_role_map: form.domainRoleMap,
    };

    try {
      let saved = null;
      if (policy?.id) {
        saved = await scopedUpdate('SchoolAuthPolicy', policy.id, payload, schoolId, true);
      } else {
        saved = await scopedCreate('SchoolAuthPolicy', schoolId, payload);
      }

      if (user?.email) {
        await scopedCreate('AuditLog', schoolId, {
          school_id: schoolId,
          user_email: user.email,
          action: 'AUTH_POLICY_UPDATED',
          entity_type: 'SchoolAuthPolicy',
          entity_id: saved?.id || policy?.id || null,
          metadata: {
            providers: payload.allowed_providers,
            domains: payload.allowed_domains,
          },
        });
      }

      toast.success('SSO settings saved');
    } catch (error) {
      toast.error('Failed to save SSO settings');
    }
  };

  if (isPolicyLoading) {
    return <div className="text-sm text-muted-foreground">Loading SSO policy...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SSO & Identity Providers</CardTitle>
        <CardDescription>
          Control which identity providers can access this school and how new users are provisioned.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
          <div>
            <p className="text-sm font-medium">Enable SSO</p>
            <p className="text-xs text-muted-foreground">Allow managed sign-in via Google or Microsoft.</p>
          </div>
          <Switch checked={form.ssoEnabled} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, ssoEnabled: checked }))} />
        </div>

        <div className="space-y-3">
          <Label>Allowed providers</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {PROVIDERS.map((provider) => {
              const checked = form.allowedProviders.includes(provider.id);
              const hasConfig = Object.prototype.hasOwnProperty.call(configuredProviders, provider.id);
              const configured = hasConfig ? configuredProviders[provider.id] : null;
              return (
                <button
                  key={provider.id}
                  type="button"
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                    checked ? 'border-primary/60 bg-primary/5' : 'border-border/60'
                  }`}
                  onClick={() => updateProvider(provider.id)}
                >
                  <span>{provider.label}</span>
                  <Badge variant={configured === false ? 'outline' : 'secondary'}>
                    {configured === false ? 'Missing credentials' : configured === true ? 'Configured' : 'Unknown'}
                  </Badge>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Provider credentials are stored in environment settings. Only configured providers can be enabled.
          </p>
        </div>

        <div className="space-y-3">
          <Label>Allowed domains</Label>
          <Input
            value={form.allowedDomains}
            onChange={(event) => setForm((prev) => ({ ...prev, allowedDomains: event.target.value }))}
            placeholder="school.edu, kollel.org"
          />
          <p className="text-xs text-muted-foreground">
            Separate multiple domains with commas. Use domain enforcement for strict access.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div>
              <p className="text-sm font-medium">Require verified domains</p>
              <p className="text-xs text-muted-foreground">Block SSO until domains are DNS verified.</p>
            </div>
            <Switch
              checked={form.requireDomainVerification}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, requireDomainVerification: checked }))}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div>
              <p className="text-sm font-medium">Require domain match</p>
              <p className="text-xs text-muted-foreground">Only allow emails from the domains above.</p>
            </div>
            <Switch
              checked={form.requireDomainMatch}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, requireDomainMatch: checked }))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div>
              <p className="text-sm font-medium">Allow personal emails</p>
              <p className="text-xs text-muted-foreground">Permit sign-ins outside managed domains.</p>
            </div>
            <Switch
              checked={form.allowPersonalEmails}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, allowPersonalEmails: checked }))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div>
              <p className="text-sm font-medium">Auto-provision members</p>
              <p className="text-xs text-muted-foreground">Create memberships automatically after SSO.</p>
            </div>
            <Switch
              checked={form.autoProvision}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, autoProvision: checked }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Default role</Label>
            <Select value={form.autoProvisionRole} onValueChange={(value) => setForm((prev) => ({ ...prev, autoProvisionRole: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {allowedDomains.length > 0 && (
          <div className="space-y-3">
            <Label>Domain role overrides</Label>
            <div className="space-y-2">
              {allowedDomains.map((domain) => (
                <div key={domain} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 p-3">
                  <div>
                    <p className="text-sm font-medium">{domain}</p>
                    <p className="text-xs text-muted-foreground">Override default auto-provision role</p>
                  </div>
                  <Select
                    value={form.domainRoleMap?.[domain] || form.autoProvisionRole}
                    onValueChange={(value) => setForm((prev) => ({
                      ...prev,
                      domainRoleMap: { ...(prev.domainRoleMap || {}), [domain]: value },
                    }))}
                  >
                    <SelectTrigger className="min-w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label>Domain verification</Label>
          <div className="space-y-2">
            {allowedDomains.length === 0 ? (
              <p className="text-xs text-muted-foreground">Add allowed domains to begin verification.</p>
            ) : (
              allowedDomains.map((domain) => {
                const record = verificationByDomain.get(domain);
                const status = record?.status || 'unverified';
                const isVerified = record?.status === 'verified' || Boolean(record?.verified_at);
                return (
                  <div key={domain} className="rounded-lg border border-border/60 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{domain}</p>
                        <p className="text-xs text-muted-foreground">
                          Status: {isVerified ? 'Verified' : status}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleChallengeDomain(domain)}>
                          {record ? 'Regenerate TXT' : 'Generate TXT'}
                        </Button>
                        <Button size="sm" onClick={() => handleVerifyDomain(domain)} disabled={isVerifying}>
                          {isVerifying ? 'Checking...' : 'Verify'}
                        </Button>
                      </div>
                    </div>
                    {activeChallenge?.domain === domain && (
                      <div className="mt-3 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                        Add the following TXT record, then click Verify.
                        <div className="mt-2 font-mono text-[11px]">
                          <div>Name: {activeChallenge.record_name}</div>
                          <div>Value: {activeChallenge.record_value}</div>
                          {activeChallenge.expires_at && <div>Expires: {new Date(activeChallenge.expires_at).toLocaleString()}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save SSO Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}
