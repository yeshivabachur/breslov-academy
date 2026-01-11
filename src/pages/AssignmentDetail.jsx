// src/pages/AssignmentDetail.jsx
import React from 'react';
import PageShell from '@/components/ui/PageShell';
import { useSession } from '@/components/hooks/useSession';
import { useQuery } from '@tanstack/react-query';
import { scopedFilter } from '@/components/api/scoped';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, AlertCircle, Award, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DashboardSkeleton } from '@/components/ui/SkeletonLoaders';
import { tokens, cx } from '@/components/theme/tokens';
import { Button } from '@/components/ui/button';

export default function AssignmentDetail() {
  const { user, activeSchoolId, isLoading: isSessionLoading } = useSession();
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('id');

  const { data: submission, isLoading: isLoadingSubmission } = useQuery({
    queryKey: ['my-submission', submissionId, activeSchoolId, user?.email],
    queryFn: async () => {
      if (!submissionId || !activeSchoolId || !user?.email) return null;
      const submissions = await scopedFilter('Submission', activeSchoolId, {
        id: submissionId,
        user_email: user.email,
      });
      return submissions[0] || null;
    },
    enabled: !!submissionId && !!activeSchoolId && !!user?.email,
  });

  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', submission?.course_id, activeSchoolId],
    queryFn: async () => {
      if (!submission?.course_id || !activeSchoolId) return null;
      const courses = await scopedFilter('Course', activeSchoolId, { id: submission.course_id });
      return courses[0] || null;
    },
    enabled: !!submission?.course_id && !!activeSchoolId,
  });

  const isLoading = isSessionLoading || isLoadingSubmission || isLoadingCourse;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!submission) {
    return (
      <PageShell title="Assignment Detail" subtitle="Could not load assignment details.">
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p>Assignment not found or you do not have permission to view it.</p>
            <Button asChild className="mt-4">
                <Link to={createPageUrl('Assignments')}>Back to Assignments</Link>
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell 
      title={submission.title || 'Assignment'} 
      subtitle={course ? `Course: ${course.title}` : 'Assignment Details'}
    >
      <div className={tokens.layout.sectionGap}>
        <Link to={createPageUrl('Assignments')}>
          <Button variant="ghost" className="group mb-6 pl-0 hover:pl-2 transition-all -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to All Assignments
          </Button>
        </Link>

        <Card className={cx(tokens.glass.card, "border-primary/20 shadow-lg")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-3xl font-bold">{submission.title || 'Assignment'}</CardTitle>
              <CardDescription className="text-muted-foreground flex items-center gap-2 mt-2">
                <BookOpen className="w-4 h-4" /> {course?.title || 'Unknown Course'}
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize text-lg px-4 py-2">
              {submission.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-3">Your Submission</h3>
              <ReactMarkdown>{submission.content || 'No submission content provided.'}</ReactMarkdown>
            </div>

            {submission.status === 'GRADED' && (
              <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Award className="w-5 h-5" /> Grade: {submission.score}%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-2">Instructor Feedback:</h4>
                  <ReactMarkdown className="prose prose-slate dark:prose-invert text-sm">
                    {submission.feedback || 'No feedback provided.'}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-2">
              {/* Add actions like "Edit Submission" or "Resubmit" based on status */}
              {submission.status !== 'GRADED' && (
                <Button asChild>
                  <Link to={createPageUrl(`SubmissionForm?id=${submission.id}`)}>Edit Submission</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
