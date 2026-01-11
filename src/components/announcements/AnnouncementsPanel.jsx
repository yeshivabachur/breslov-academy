import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Megaphone, Pin } from 'lucide-react';
import { buildCacheKey, scopedCreate, scopedFilter } from '@/components/api/scoped';

export default function AnnouncementsPanel({ user, schoolId }) {
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
  const readFields = [
    'id',
    'announcement_id',
    'read_at'
  ];

  const { data: announcements = [] } = useQuery({
    queryKey: buildCacheKey('announcements', schoolId),
    queryFn: () => scopedFilter(
      'Announcement',
      schoolId,
      { published_at: { $ne: null } },
      '-created_date',
      10,
      { fields: announcementFields }
    ),
    enabled: !!schoolId
  });

  const { data: readStatus = [] } = useQuery({
    queryKey: buildCacheKey('announcement-reads', schoolId, user?.email),
    queryFn: () => scopedFilter(
      'UserAnnouncementRead',
      schoolId,
      { user_email: user.email },
      null,
      500,
      { fields: readFields }
    ),
    enabled: !!user && !!schoolId
  });

  const markReadMutation = useMutation({
    mutationFn: (announcementId) => scopedCreate('UserAnnouncementRead', schoolId, {
      announcement_id: announcementId,
      user_email: user.email,
      read_at: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('announcement-reads', schoolId, user?.email));
    }
  });

  const readAnnouncementIds = new Set(readStatus.map(r => r.announcement_id));
  const unreadCount = announcements.filter(a => !readAnnouncementIds.has(a.id)).length;

  if (announcements.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Megaphone className="w-5 h-5 mr-2" />
            Announcements
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} new</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {announcements.slice(0, 5).map((announcement) => {
            const isRead = readAnnouncementIds.has(announcement.id);
            
            return (
              <div
                key={announcement.id}
                className={`p-3 rounded-lg border ${
                  isRead ? 'bg-slate-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm">{announcement.title}</h4>
                    {announcement.pinned && (
                      <Pin className="w-3 h-3 text-amber-600" />
                    )}
                  </div>
                  {!isRead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markReadMutation.mutate(announcement.id)}
                      className="text-xs h-6 px-2"
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
                <p className="text-sm text-slate-700">{announcement.body}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(announcement.published_at || announcement.created_date).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
