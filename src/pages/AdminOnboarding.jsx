// src/pages/AdminOnboarding.jsx
import React, { useEffect, useState } from 'react';
import PageShell from '@/components/ui/PageShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, ArrowRight, Loader2, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useSession } from '@/components/hooks/useSession';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { Switch } from '@/components/ui/switch';
import { scopedCreate, scopedFilter, scopedUpdate } from '@/components/api/scoped';

const steps = [
  { title: 'Basics', subtitle: 'Set your school name, slug, and branding.' },
  { title: 'Protection', subtitle: 'Define how previews and content protection behave.' },
  { title: 'Finish', subtitle: 'Review and enter your admin dashboard.' }
];

export default function AdminOnboarding() {
  const { activeSchoolId, activeSchool, user, memberships, isLoading } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolSlug: '',
    schoolDescription: '',
    primaryColor: '#d4af37',
    accentColor: '#1e40af',
    protectContent: true,
    allowPreviews: true,
    policyId: null,
  });
  const [initialized, setInitialized] = useState(false);

  const isNewSchool = !activeSchoolId;
  const activeMembership = memberships?.find((m) => String(m.school_id) === String(activeSchoolId));
  const isAdmin = ['OWNER', 'ADMIN'].includes(String(activeMembership?.role || '').toUpperCase());

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    if (!activeSchoolId) {
      navigate(createPageUrl('SchoolNew'), { replace: true });
      return;
    }
    if (!isAdmin) {
      navigate(createPageUrl('Dashboard'), { replace: true });
    }
  }, [isLoading, user, activeSchoolId, isAdmin, navigate]);

  // If already onboarded or no activeSchoolId for setup, redirect
  useEffect(() => {
    if (!isNewSchool && activeSchoolId && memberships?.length > 0) {
      // If user has memberships and active school, they are already onboarded or not a new school admin
      // Allow admins to finish onboarding if they choose, otherwise they can return to admin.
    }
  }, [isNewSchool, activeSchoolId, memberships, navigate]);

  useEffect(() => {
    if (!activeSchool || initialized) return;
    setFormData((prev) => ({
      ...prev,
      schoolName: activeSchool.name || prev.schoolName,
      schoolSlug: activeSchool.slug || prev.schoolSlug,
      schoolDescription: activeSchool.description || prev.schoolDescription,
      primaryColor: activeSchool.brand_primary || prev.primaryColor,
      accentColor: activeSchool.brand_accent || prev.accentColor,
    }));
    setInitialized(true);
  }, [activeSchool, initialized]);

  const { data: policy, isLoading: isPolicyLoading } = useQuery({
    queryKey: ['content-protection-policy', activeSchoolId],
    queryFn: async () => {
      const policies = await scopedFilter('ContentProtectionPolicy', activeSchoolId, {}, '-created_date', 1);
      return policies?.[0] || null;
    },
    enabled: !!activeSchoolId,
  });

  const createPolicyMutation = useMutation({
    mutationFn: (payload) => scopedCreate('ContentProtectionPolicy', activeSchoolId, payload),
    onSuccess: (created) => {
      setFormData((prev) => ({
        ...prev,
        policyId: created?.id || prev.policyId,
        protectContent: created?.protect_content ?? prev.protectContent,
        allowPreviews: created?.allow_previews ?? prev.allowPreviews,
      }));
    },
    onError: (err) => {
      toast.error('Failed to initialize protection policy: ' + err.message);
    },
  });

  useEffect(() => {
    if (!activeSchoolId || isPolicyLoading) return;
    if (policy?.id) {
      setFormData((prev) => ({
        ...prev,
        policyId: policy.id,
        protectContent: policy.protect_content ?? prev.protectContent,
        allowPreviews: policy.allow_previews ?? prev.allowPreviews,
      }));
      return;
    }
    if (!createPolicyMutation.isPending && !formData.policyId) {
      createPolicyMutation.mutate({
        protect_content: true,
        allow_previews: true,
        max_preview_chars: 1500,
        max_preview_seconds: 90,
        watermark_enabled: true,
        block_copy: true,
        block_right_click: true,
        block_print: true,
        copy_mode: 'ADDON',
        download_mode: 'ADDON',
      });
    }
  }, [activeSchoolId, isPolicyLoading, policy, createPolicyMutation, formData.policyId]);

  const updateSchoolMutation = useMutation({
    mutationFn: (data) => {
      if (!activeSchoolId) {
        throw new Error('No active school');
      }
      return base44.entities.School.update(activeSchoolId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['session']);
      queryClient.invalidateQueries(['school', activeSchoolId]);
      toast.success('School settings updated!');
      setStep((prev) => prev + 1);
    },
    onError: (err) => {
      toast.error('Failed to update school: ' + err.message);
    }
  });

  const updateProtectionPolicyMutation = useMutation({
    mutationFn: (data) => {
      if (!formData.policyId) {
        throw new Error('Missing protection policy');
      }
      return scopedUpdate('ContentProtectionPolicy', formData.policyId, data, activeSchoolId, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['session']);
      queryClient.invalidateQueries(['content-protection-policy']);
      toast.success('Content protection settings updated!');
      setStep((prev) => prev + 1);
    },
    onError: (err) => {
      toast.error('Failed to update content protection: ' + err.message);
    }
  });

  const handleNext = async (e) => {
    e.preventDefault();
    if (step === 1) {
      updateSchoolMutation.mutate({
        name: formData.schoolName,
        slug: formData.schoolSlug,
        description: formData.schoolDescription,
        brand_primary: formData.primaryColor,
        brand_accent: formData.accentColor,
      });
    } else if (step === 2) {
      updateProtectionPolicyMutation.mutate({
        protect_content: formData.protectContent,
        allow_previews: formData.allowPreviews,
      });
    } else if (step === 3) {
      navigate(createPageUrl('SchoolAdmin'), { replace: true });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleNext} className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              Basic Information
            </h3>
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                placeholder="e.g., Breslov Wisdom Center"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolSlug">URL Slug</Label>
              <Input
                id="schoolSlug"
                value={formData.schoolSlug}
                onChange={(e) => setFormData({ ...formData, schoolSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="wisdom-center"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolDescription">Description</Label>
              <Textarea
                id="schoolDescription"
                value={formData.schoolDescription}
                onChange={(e) => setFormData({ ...formData, schoolDescription: e.target.value })}
                rows={3}
                placeholder="Describe your school's mission and offerings."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <Input
                  id="accentColor"
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={updateSchoolMutation.isPending}>
              {updateSchoolMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              Save & Continue
            </Button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleNext} className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              Content Protection
            </h3>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="protectContent">Enable Content Protection</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent unauthorized copying and downloading of your content.
                </p>
              </div>
              <Switch
                id="protectContent"
                checked={formData.protectContent}
                onCheckedChange={(checked) => setFormData({ ...formData, protectContent: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="allowPreviews">Allow Previews</Label>
                <p className="text-sm text-muted-foreground">
                  Offer limited previews of locked content to attract new learners.
                </p>
              </div>
              <Switch
                id="allowPreviews"
                checked={formData.allowPreviews}
                onCheckedChange={(checked) => setFormData({ ...formData, allowPreviews: checked })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={updateProtectionPolicyMutation.isPending}>
              {updateProtectionPolicyMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              Save & Finish
            </Button>
          </form>
        );
      case 3:
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold">Setup Complete!</h3>
            <p className="text-muted-foreground">Your school "{formData.schoolName}" is now ready.</p>
            <Button onClick={() => navigate(createPageUrl('SchoolAdmin'))}>
              Go to Admin Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading || isPolicyLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <PageShell 
      title="School Setup Wizard" 
      subtitle={isNewSchool ? "Let's get your new school configured." : "Configure your school's essential settings."}
    >
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Step {step} of 3</CardTitle>
            <CardDescription>{steps[step - 1]?.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
