import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bookmark, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { buildCacheKey, scopedCreate, scopedDelete, scopedFilter } from '@/components/api/scoped';

export default function BookmarkPanel({ lesson, user, currentTime, onSeek }) {
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();
  const schoolId = lesson?.school_id;

  const { data: bookmarks = [] } = useQuery({
    queryKey: buildCacheKey('bookmarks', schoolId, lesson?.id, user?.email),
    queryFn: () => scopedFilter('Bookmark', schoolId, {
      lesson_id: lesson.id,
      user_email: user.email
    }, '-created_date'),
    enabled: !!lesson && !!user && !!schoolId
  });

  const createBookmarkMutation = useMutation({
    mutationFn: (data) => scopedCreate('Bookmark', schoolId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('bookmarks', schoolId, lesson?.id, user?.email));
      setShowDialog(false);
      toast.success('Bookmark added!');
    }
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: (id) => scopedDelete('Bookmark', id, schoolId, true),
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('bookmarks', schoolId, lesson?.id, user?.email));
      toast.success('Bookmark deleted');
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    createBookmarkMutation.mutate({
      lesson_id: lesson.id,
      user_email: user.email,
      label: formData.get('label'),
      position_seconds: Math.floor(currentTime)
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Bookmark className="w-5 h-5 mr-2" />
          Bookmarks
        </CardTitle>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bookmark</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">
                  Current time: {formatTime(currentTime)}
                </p>
                <Input name="label" placeholder="Bookmark label" required />
              </div>
              <Button type="submit" className="w-full">Save Bookmark</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No bookmarks yet</p>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                <button
                  onClick={() => onSeek(bookmark.position_seconds)}
                  className="flex-1 text-left"
                >
                  <p className="font-medium text-sm">{bookmark.label}</p>
                  <p className="text-xs text-slate-500">{formatTime(bookmark.position_seconds)}</p>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteBookmarkMutation.mutate(bookmark.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
