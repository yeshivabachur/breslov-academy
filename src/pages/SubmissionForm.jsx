// src/pages/SubmissionForm.jsx
import React, { useState, useEffect } from 'react';
import PageShell from '@/components/ui/PageShell';
import { useSession } from '@/components/hooks/useSession';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scopedFilter, scopedCreate, scopedUpdate } from '@/components/api/scoped';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardSkeleton } from '@/components/ui/SkeletonLoaders';

export default function SubmissionForm() {
  const { user, activeSchoolId, isLoading: isSessionLoading } = useSession();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const existingSubmissionId = searchParams.get('id');
  const assignmentId = searchParams.get('assignmentId'); // If creating a new submission for an assignment

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState(''); // Simple string for now, could be JSON or file uploads

  const { data: existingSubmission, isLoading: isLoadingExistingSubmission } = useQuery({
    queryKey: ['submission', existingSubmissionId, activeSchoolId, user?.email],
    queryFn: async () => {
      if (!existingSubmissionId || !activeSchoolId || !user?.email) return null;
      const submissions = await scopedFilter('Submission', activeSchoolId, {
        id: existingSubmissionId,
        user_email: user.email,
      });
      return submissions[0] || null;
    },
    enabled: !!existingSubmissionId && !!activeSchoolId && !!user?.email,
  });

  useEffect(() => {
    if (existingSubmission) {
      setTitle(existingSubmission.title || '');
      setContent(existingSubmission.content || '');
      setAttachments(existingSubmission.attachments ? JSON.stringify(existingSubmission.attachments) : '');
    } else if (assignmentId) {
      // Potentially fetch assignment details here to pre-fill title or instructions
      setTitle(`Submission for Assignment ${assignmentId}`); // Placeholder
    }
  }, [existingSubmission, assignmentId]);

  const createSubmissionMutation = useMutation({
    mutationFn: (newSubmission) => scopedCreate('Submission', activeSchoolId, {
      ...newSubmission,
      school_id: activeSchoolId,
      user_email: user.email,
      status: 'PENDING',
      created_by: user.email,
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['my-submissions']);
      toast.success('Submission created successfully!');
      navigate(createPageUrl(`AssignmentDetail?id=${data.id}`));
    },
    onError: (err) => {
      toast.error('Failed to create submission: ' + err.message);
    }
  });

  const updateSubmissionMutation = useMutation({
    mutationFn: (updatedSubmission) => scopedUpdate('Submission', existingSubmissionId, updatedSubmission, activeSchoolId, true),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['my-submissions']);
      toast.success('Submission updated successfully!');
      navigate(createPageUrl(`AssignmentDetail?id=${data.id}`));
    },
    onError: (err) => {
      toast.error('Failed to update submission: ' + err.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      title,
      content,
      attachments: attachments ? JSON.parse(attachments) : [],
      // course_id and lesson_id would typically come from the assignment itself
      // For now, these might need to be added or derived if creating new for an assignmentId
    };

    if (existingSubmissionId) {
      updateSubmissionMutation.mutate(submissionData);
    } else {
      createSubmissionMutation.mutate(submissionData);
    }
  };

  const isLoading = isSessionLoading || isLoadingExistingSubmission;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!user || !activeSchoolId) {
    return (
      <PageShell title="Submit Assignment" subtitle="Please log in and select a school.">
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p>Authentication or active school selection required.</p>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell 
      title={existingSubmissionId ? 'Edit Submission' : 'Submit Assignment'}
      subtitle={existingSubmissionId ? `ID: ${existingSubmissionId}` : 'New assignment submission'}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to={createPageUrl('Assignments')}>
          <Button variant="ghost" className="group mb-6 pl-0 hover:pl-2 transition-all -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Assignments
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{existingSubmissionId ? 'Edit Your Submission' : 'New Assignment Submission'}</CardTitle>
            <CardDescription>
              {existingSubmissionId ? 'Modify your previously submitted work.' : 'Submit your completed assignment here.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Essay on Chapter 1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your submission here..."
                  rows={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (JSON string for now)</Label>
                <Input
                  id="attachments"
                  value={attachments}
                  onChange={(e) => setAttachments(e.target.value)}
                  placeholder='e.g., [{"name": "file1.pdf", "url": "..."}]'
                />
                <p className="text-xs text-muted-foreground">
                  (Note: Currently supports JSON string of attachments. Full file upload coming soon.)
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={createSubmissionMutation.isPending || updateSubmissionMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {existingSubmissionId ? 'Update Submission' : 'Submit Assignment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}