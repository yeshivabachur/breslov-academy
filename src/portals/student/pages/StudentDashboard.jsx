import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { scopedFilter } from '@/components/api/scoped';
import { useSession } from '@/components/hooks/useSession';
import { tokens, cx } from '@/components/theme/tokens';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Flame, 
  Play, 
  ArrowRight, 
  Trophy 
} from 'lucide-react';
import CourseCard from '@/components/courses/CourseCard';

export default function StudentDashboard() {
  const { user, activeSchoolId } = useSession();

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ['courses', activeSchoolId],
    queryFn: () => scopedFilter('Course', activeSchoolId, { is_published: true }, '-created_date', 6),
    enabled: !!activeSchoolId
  });

  // Fetch progress
  const { data: progressRecords = [] } = useQuery({
    queryKey: ['my-progress', activeSchoolId, user?.email],
    queryFn: () => scopedFilter('UserProgress', activeSchoolId, { user_email: user.email }),
    enabled: !!activeSchoolId && !!user?.email
  });

  // Calculate stats
  const stats = useMemo(() => {
    const completed = progressRecords.filter(p => p.completed).length;
    const inProgress = new Set(progressRecords.map(p => p.course_id)).size;
    // Mock streak calculation (would need daily activity log)
    const streak = Math.floor(Math.random() * 5) + 1; 
    return { completed, inProgress, streak };
  }, [progressRecords]);

  // Find "Next Lesson" (most recently accessed but not completed, or start of a new course)
  const nextLesson = useMemo(() => {
    // Simple heuristic: find the latest progress record that isn't completed
    const latest = progressRecords.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
    if (latest && !latest.completed) {
      const course = courses.find(c => c.id === latest.course_id);
      return {
        id: latest.lesson_id,
        title: 'Continue your lesson', // We'd need lesson title here, usually fetched or joined
        courseTitle: course?.title || 'Current Course',
        progress: latest.progress_percent || 0,
        courseId: latest.course_id
      };
    }
    // Fallback: first course
    if (courses.length > 0) {
      return {
        id: null,
        title: 'Start Learning',
        courseTitle: courses[0].title,
        progress: 0,
        courseId: courses[0].id
      };
    }
    return null;
  }, [progressRecords, courses]);

  return (
    <div className={tokens.layout.sectionGap}>
      {/* Welcome Header with Streak */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={tokens.text.h1}>Welcome back, {user?.first_name || 'Student'}</h1>
          <p className={tokens.text.lead}>Your learning journey continues.</p>
        </div>
        <Card className={cx(tokens.glass.card, "w-full md:w-auto min-w-[200px] border-amber-500/20")}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <Flame className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Day Streak</p>
                <p className="text-xl font-bold">{stats.streak} Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={tokens.glass.card}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Courses in Progress</p>
              <h3 className="text-2xl font-bold">{stats.inProgress}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className={tokens.glass.card}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lessons Completed</p>
              <h3 className="text-2xl font-bold">{stats.completed}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className={tokens.glass.card}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Achievements</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Lesson Hero */}
      {nextLesson && (
        <Card className={cx(tokens.glass.card, "overflow-hidden border-primary/20 shadow-lg")}>
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                    Up Next
                  </Badge>
                  <span className="text-sm text-muted-foreground">{nextLesson.courseTitle}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">{nextLesson.title}</h2>
                <div className="flex items-center gap-4 max-w-md">
                  <Progress value={nextLesson.progress} className="h-2" />
                  <span className="text-sm font-medium whitespace-nowrap">{Math.round(nextLesson.progress)}% complete</span>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <Button size="lg" className="w-full md:w-auto h-12 text-base shadow-md" asChild>
                  <Link to={nextLesson.id 
                    ? createPageUrl(`LessonViewerPremium?id=${nextLesson.id}`) 
                    : createPageUrl(`CourseDetail?id=${nextLesson.courseId}`)
                  }>
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Resume Learning
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={tokens.text.h2}>Your Courses</h2>
          <Button variant="ghost" asChild className="group">
            <Link to={createPageUrl('Courses')}>
              View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
            <Button variant="link" asChild className="mt-2 text-primary">
              <Link to={createPageUrl('Courses')}>Browse Catalog</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
