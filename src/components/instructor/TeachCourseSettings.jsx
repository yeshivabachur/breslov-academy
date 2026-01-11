import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedCreate, scopedFilter, scopedUpdate } from '@/components/api/scoped';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'he', label: 'Hebrew' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ru', label: 'Russian' }
];

export default function TeachCourseSettings({ course }) {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const courseSchoolId = course?.school_id;

  const { data: auditEntries = [] } = useQuery({
    queryKey: buildCacheKey('course-settings-audit', courseSchoolId, course?.id),
    queryFn: () => scopedFilter(
      'AuditLog',
      courseSchoolId,
      { entity_type: 'Course', entity_id: course.id },
      '-created_date',
      5
    ),
    enabled: !!courseSchoolId && !!course?.id
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ payload, changes }) => {
      await scopedUpdate('Course', course.id, payload, courseSchoolId, true);

      if (!courseSchoolId || !user?.email || !changes || Object.keys(changes).length === 0) return;

      const nextStatus = changes.status?.to;
      let action = 'COURSE_SETTINGS_UPDATED';
      if (nextStatus === 'published') action = 'PUBLISH_COURSE';
      else if (nextStatus === 'archived') action = 'ARCHIVE_COURSE';
      else if (nextStatus === 'draft') action = 'UNPUBLISH_COURSE';

      try {
        await scopedCreate('AuditLog', courseSchoolId, {
          user_email: user.email,
          action,
          entity_type: 'Course',
          entity_id: course.id,
          metadata: { changes }
        });
      } catch (error) {
        // Best-effort audit logging.
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('course', courseSchoolId, course?.id));
      queryClient.invalidateQueries(buildCacheKey('course-settings-audit', courseSchoolId, course?.id));
      toast.success('Settings updated!');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const payload = {
      status: formData.get('status'),
      visibility: formData.get('visibility'),
      language: formData.get('language'),
      drip_enabled: formData.get('drip_enabled') === 'on'
    };
    const changes = {};
    if (payload.status !== (course?.status || 'draft')) {
      changes.status = { from: course?.status || 'draft', to: payload.status };
    }
    if (payload.visibility !== (course?.visibility || 'school_only')) {
      changes.visibility = { from: course?.visibility || 'school_only', to: payload.visibility };
    }
    if (payload.language !== (course?.language || 'en')) {
      changes.language = { from: course?.language || 'en', to: payload.language };
    }
    if (payload.drip_enabled !== !!course?.drip_enabled) {
      changes.drip_enabled = { from: !!course?.drip_enabled, to: payload.drip_enabled };
    }

    updateCourseMutation.mutate({ payload, changes });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Course Language</Label>
            <Select name="language" defaultValue={course.language || 'en'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This helps students filter courses by language.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Course Status</Label>
            <Select name="status" defaultValue={course.status || 'draft'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select name="visibility" defaultValue={course.visibility || 'school_only'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school_only">School Only</SelectItem>
                <SelectItem value="public_unlisted">Public (Unlisted)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label>Drip Scheduling</Label>
              <p className="text-sm text-slate-500">
                Release lessons on a schedule
              </p>
            </div>
            <Switch name="drip_enabled" defaultChecked={course.drip_enabled} />
          </div>

          <Button type="submit" className="w-full">Save Settings</Button>
        </form>

        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">Recent changes</h4>
            <Badge variant="outline">{auditEntries.length}</Badge>
          </div>
          <div className="mt-3 space-y-2">
            {auditEntries.length === 0 ? (
              <p className="text-xs text-muted-foreground">No recent course settings updates.</p>
            ) : (
              auditEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">{entry.action || 'UPDATE'}</p>
                    <p className="text-muted-foreground">{entry.user_email || 'Unknown user'}</p>
                  </div>
                  <span className="text-muted-foreground">
                    {entry.created_date ? new Date(entry.created_date).toLocaleString() : 'Just now'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
