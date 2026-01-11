import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Pin } from 'lucide-react';
import { toast } from 'sonner';
import { buildCacheKey, scopedCreate, scopedFilter, scopedUpdate } from '@/components/api/scoped';

export default function SchoolAnnouncements({ school, user }) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const announcementFields = [
    'id',
    'title',
    'body',
    'audience',
    'pinned',
    'published_at',
    'created_date'
  ];

  const { data: announcements = [] } = useQuery({
    queryKey: buildCacheKey('announcements', school?.id),
    queryFn: () => scopedFilter(
      'Announcement',
      school.id,
      {},
      '-created_date',
      200,
      { fields: announcementFields }
    ),
    enabled: !!school
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: (data) => scopedCreate('Announcement', school.id, data),
    onSuccess: async (announcement) => {
      queryClient.invalidateQueries(buildCacheKey('announcements', school?.id));
      setShowForm(false);
      toast.success('Announcement published!');

      if (announcement?.id) {
        try {
          await scopedCreate('AuditLog', school.id, {
            school_id: school.id,
            user_email: user?.email,
            action: 'ANNOUNCEMENT_PUBLISHED',
            entity_type: 'Announcement',
            entity_id: announcement.id
          });
        } catch (error) {
          // Best effort audit
        }
      }
    }
  });

  const togglePinMutation = useMutation({
    mutationFn: async ({ id, pinned }) => {
      const result = await scopedUpdate('Announcement', id, { pinned }, school.id, true);
      try {
        await scopedCreate('AuditLog', school.id, {
          school_id: school.id,
          user_email: user?.email,
          action: pinned ? 'ANNOUNCEMENT_PINNED' : 'ANNOUNCEMENT_UNPINNED',
          entity_type: 'Announcement',
          entity_id: id
        });
      } catch (error) {
        // Best effort audit
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('announcements', school?.id));
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    createAnnouncementMutation.mutate({
      school_id: school.id,
      title: formData.get('title'),
      body: formData.get('body'),
      audience: formData.get('audience'),
      created_by_user: user.email,
      published_at: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Megaphone className="w-5 h-5 mr-2" />
            School Announcements
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Announcement'}
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleCreate} className="space-y-4 mb-6 p-4 bg-slate-50 rounded-lg">
              <Input name="title" placeholder="Announcement title" required />
              <Textarea name="body" placeholder="Announcement message" rows={4} required />
              <Select name="audience" defaultValue="ALL">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Members</SelectItem>
                  <SelectItem value="STUDENTS">Students Only</SelectItem>
                  <SelectItem value="INSTRUCTORS">Instructors Only</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Publish Announcement</Button>
            </form>
          )}

          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold">{announcement.title}</h4>
                      {announcement.pinned && (
                        <Pin className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{announcement.body}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{announcement.audience}</Badge>
                      <span className="text-xs text-slate-500">
                        {new Date(announcement.published_at || announcement.created_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePinMutation.mutate({
                      id: announcement.id,
                      pinned: !announcement.pinned
                    })}
                  >
                    <Pin className={`w-4 h-4 ${announcement.pinned ? 'text-amber-600' : 'text-slate-400'}`} />
                  </Button>
                </div>
              </div>
            ))}

            {announcements.length === 0 && !showForm && (
              <p className="text-slate-500 text-center py-8">No announcements yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
