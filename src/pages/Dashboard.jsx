import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { buildCacheKey, scopedFilter } from '@/components/api/scoped';
import { useSession } from '@/components/hooks/useSession';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, CheckCircle, Clock, Crown, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { tokens, cx } from '@/components/theme/tokens';
import StatCard from '@/components/dashboard/StatCard';
import CourseCard from '@/components/courses/CourseCard';
import CourseRecommendations from '@/components/ai/CourseRecommendations';
import AnnouncementsPanel from '@/components/announcements/AnnouncementsPanel';
import { DashboardSkeleton } from '@/components/ui/SkeletonLoaders';
import StudyCalendar from '@/components/scheduling/StudyCalendar';
import WellnessTracker from '@/components/wellness/WellnessTracker';

export default function Dashboard() {
  const { user, activeSchoolId, isLoading } = useSession();
  const [userTier, setUserTier] = useState('free');

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: buildCacheKey('subscription', activeSchoolId, user?.email),
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await scopedFilter('Subscription', activeSchoolId, { user_email: user.email });
      return subs[0] || null;
    },
    enabled: !!user?.email && !!activeSchoolId
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: buildCacheKey('courses', activeSchoolId),
    queryFn: async () => {
      if (!activeSchoolId) return [];
      let schoolCourses = await scopedFilter('Course', activeSchoolId, {
        is_published: true,
      }, '-created_date', 6);
      
      // Fallback to legacy school if no courses
      if (schoolCourses.length === 0) {
        const legacySchools = await base44.entities.School.filter({ slug: 'legacy' });
        if (legacySchools.length > 0) {
          schoolCourses = await scopedFilter('Course', legacySchools[0].id, { is_published: true }, '-created_date', 6);
        }
      }
      
      return schoolCourses;
    },
    enabled: !!activeSchoolId
  });

  const { data: progress = [] } = useQuery({
    queryKey: buildCacheKey('progress', activeSchoolId, user?.email),
    queryFn: async () => {
      const courseProgress = await scopedFilter('UserProgress', activeSchoolId, { user_email: user.email });
      const insights = await scopedFilter('LearningInsight', activeSchoolId, { user_email: user.email, is_read: false });
      return { courseProgress, insights };
    },
    enabled: !!activeSchoolId && !!user?.email
  });

  useEffect(() => {
    if (!isLoading && !user) {
      try { base44.auth.redirectToLogin(); } catch {}
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (subscription?.tier) {
      setUserTier(subscription.tier);
    }
  }, [subscription]);

  // Check for loading states AFTER all hooks
  if (isLoading || subLoading || coursesLoading) {
    return <DashboardSkeleton />;
  }

  const completedLessons = progress?.courseProgress?.filter(p => p.completed).length || 0;
  const inProgressCourses = [...new Set(progress?.courseProgress?.filter(p => !p.completed).map(p => p.course_id) || [])].length;

  const tierBenefits = {
    free: { name: 'Free', color: 'text-slate-600 dark:text-slate-400', icon: Star },
    premium: { name: 'Premium', color: 'text-blue-600 dark:text-blue-400', icon: Crown },
    elite: { name: 'Elite', color: 'text-amber-600 dark:text-amber-400', icon: Crown }
  };

  const currentTier = tierBenefits[userTier];

  return (
    <div className={tokens.layout.sectionGap}>
      {/* Welcome Section */}
      <div className={cx(tokens.glass.card, "p-8 md:p-12 overflow-hidden")}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className={tokens.text.h1}>
              Shalom, {user?.full_name || 'Student'}
            </h1>
            <p className={cx(tokens.text.lead, "mt-2 max-w-2xl")}>
              Continue your journey through the teachings of Rebbe Nachman.
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-2 mt-4">
              {React.createElement(currentTier.icon, { className: `w-5 h-5 ${currentTier.color}` })}
              <span className={`font-semibold ${currentTier.color}`}>
                {currentTier.name} Member
              </span>
            </div>
          </div>
          {userTier === 'free' && (
            <Link to={createPageUrl('Subscription')}>
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className={cx("grid grid-cols-1 md:grid-cols-3", tokens.layout.gridGap)}>
        <StatCard
          icon={BookOpen}
          label="Courses Available"
          value={courses.length}
          color="text-blue-600 dark:text-blue-400"
          bg="bg-blue-100 dark:bg-blue-900/20"
        />
        <StatCard
          icon={CheckCircle}
          label="Lessons Completed"
          value={completedLessons}
          color="text-green-600 dark:text-green-400"
          bg="bg-green-100 dark:bg-green-900/20"
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={inProgressCourses}
          color="text-amber-600 dark:text-amber-400"
          bg="bg-amber-100 dark:bg-amber-900/20"
        />
      </div>

      {/* Featured Quote */}
      <div className={cx(tokens.glass.card, "p-8 border-l-4 border-l-amber-500")}>
        <blockquote className="text-xl md:text-2xl font-serif italic text-foreground/80 mb-4 text-center md:text-left">
          "The essence of Torah study is to turn the intellect toward Hashem and to come closer to Him through the wisdom of Torah."
        </blockquote>
        <cite className="block text-sm font-semibold text-muted-foreground text-center md:text-left">
          — Likutey Moharan I:25
        </cite>
      </div>

      {/* Announcements */}
      <AnnouncementsPanel user={user} schoolId={activeSchoolId} />

      {/* AI Recommendations */}
      <CourseRecommendations 
        user={user} 
        userProgress={progress} 
        courses={courses} 
        schoolId={activeSchoolId}
      />

      {/* Featured Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className={tokens.text.h2}>Featured Courses</h2>
          <Link to={createPageUrl('Courses')}>
            <Button variant="ghost" className="group text-muted-foreground hover:text-foreground">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className={cx("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3", tokens.layout.gridGap)}>
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} userTier={userTier} />
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-16 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No courses available yet</p>
            <p className="text-muted-foreground mt-2">Check back soon for new Torah content</p>
          </div>
        )}
      </div>

      {/* Wellness + Schedule */}
      {user?.email && activeSchoolId && (
        <div className={cx("grid grid-cols-1 lg:grid-cols-2", tokens.layout.gridGap)}>
          <StudyCalendar userEmail={user.email} schoolId={activeSchoolId} />
          <WellnessTracker userEmail={user.email} schoolId={activeSchoolId} />
        </div>
      )}
    </div>
  );
}
