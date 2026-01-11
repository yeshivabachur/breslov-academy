// src/pages/Assignments.jsx
import React from 'react';
import PageShell from '@/components/ui/PageShell';
import { useSession } from '@/components/hooks/useSession';
import { useQuery } from '@tanstack/react-query';
import { scopedFilter } from '@/components/api/scoped';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/SkeletonLoaders';
import { tokens, cx } from '@/components/theme/tokens';

export default function Assignments() {
  const { user, activeSchoolId, isLoading: isSessionLoading } = useSession();

  const { data: submissions = [], isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['my-submissions', activeSchoolId, user?.email],
    queryFn: () => scopedFilter('Submission', activeSchoolId, { user_email: user.email }, '-created_date'),
    enabled: !!activeSchoolId && !!user?.email,
  });

  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses', activeSchoolId],
    queryFn: () => scopedFilter('Course', activeSchoolId, { is_published: true }),
    enabled: !!activeSchoolId,
  });

  const isLoading = isSessionLoading || isLoadingSubmissions || isLoadingCourses;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const getSubmissionStatus = (submission) => {
    if (submission.status === 'GRADED') {
      return (
        <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
          <CheckCircle className="w-3 h-3 mr-1" /> Graded ({submission.score}%)
        </Badge>
      );
    } else if (submission.status === 'PENDING') {
      return (
        <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>
      );
    }
    return null;
  };

  if (!user || !activeSchoolId) {
    return (
      <PageShell title="Assignments" subtitle="Please log in and select a school to view your assignments.">
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
      title="My Assignments" 
      subtitle="View your assigned tasks and track your submission status."
    >
      <div className="space-y-6">
        {submissions.length === 0 ? (
          <Card className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No assignments found yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => {
              const course = courses.find(c => c.id === submission.course_id);
              const assignmentTitle = submission.title || 'Assignment'; // Assuming submissions have titles
              
              return (
                <Card 
                  key={submission.id} 
                  className={cx(
                    tokens.glass.card,
                    "hover:border-primary/50 hover:shadow-md transition-all duration-300"
                  )}
                >
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg truncate">{assignmentTitle}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {course ? course.title : 'Unknown Course'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted: {new Date(submission.created_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getSubmissionStatus(submission)}
                      <Button asChild variant="outline" size="sm">
                        <Link to={createPageUrl(`AssignmentDetail?id=${submission.id}`)}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
