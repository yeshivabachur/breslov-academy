import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, CheckCircle, Clock, Crown, ArrowRight, Star, Flame, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import StatCard from '../components/dashboard/StatCard';
import CourseCard from '../components/courses/CourseCard';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userTier, setUserTier] = useState('free');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await base44.entities.Subscription.filter({ user_email: user.email });
      return subs[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.filter({ is_published: true }, '-created_date', 6)
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ['progress', user?.email],
    queryFn: () => base44.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user?.email
  });

  const { data: studyStreak } = useQuery({
    queryKey: ['streak', user?.email],
    queryFn: async () => {
      const streaks = await base44.entities.StudyStreak.filter({ user_email: user.email });
      return streaks[0] || null;
    },
    enabled: !!user?.email
  });

  useEffect(() => {
    if (subscription?.tier) {
      setUserTier(subscription.tier);
    }
  }, [subscription]);

  const completedLessons = userProgress?.filter(p => p.completed).length || 0;
  const inProgressCourseIds = [...new Set(userProgress?.filter(p => !p.completed).map(p => p.course_id) || [])];
  const inProgressCourses = courses.filter(c => inProgressCourseIds.includes(c.id));

  const tierBenefits = {
    free: { name: 'Free', color: 'text-slate-600', icon: Star },
    premium: { name: 'Premium', color: 'text-blue-600', icon: Crown },
    elite: { name: 'Elite', color: 'text-amber-600', icon: Crown }
  };

  const currentTier = tierBenefits[userTier];

  const dailyWisdom = [
    {
      text: "It is a great mitzvah to always be happy.",
      source: "Likutey Moharan II:24"
    },
    {
      text: "All the world is a very narrow bridge, but the essential thing is not to fear at all.",
      source: "Likutey Moharan II:48"
    },
    {
      text: "If you believe that you can damage, then believe that you can fix.",
      source: "Likutey Moharan II:112"
    },
    {
      text: "The whole world was created for my sake, therefore I must constantly examine myself.",
      source: "Based on Likutey Moharan"
    },
    {
      text: "Prayer is the highest form of wisdom.",
      source: "Likutey Moharan I:9"
    }
  ];

  const todayWisdom = dailyWisdom[new Date().getDay() % dailyWisdom.length];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-700">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Shalom, {user?.full_name?.split(' ')[0] || 'Student'}
        </h1>
        <p className="text-slate-300 text-lg md:text-xl mb-6">
          Continue your journey through the teachings of Rebbe Nachman of Breslov
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span className="text-white font-semibold">{studyStreak?.current_streak || 0} Day Streak</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-white font-semibold">{completedLessons} Lessons Completed</span>
          </div>
        </div>
      </div>

      {/* Daily Wisdom */}
      <Card className="bg-gradient-to-br from-amber-50 via-white to-blue-50 border-2 border-amber-200 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-serif text-slate-800 flex items-center space-x-2">
            <Star className="w-6 h-6 text-amber-500" />
            <span>Daily Wisdom</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-4 border-amber-500 pl-6 py-2">
            <p className="text-slate-700 text-xl md:text-2xl italic font-serif leading-relaxed mb-3">
              "{todayWisdom.text}"
            </p>
            <footer className="text-slate-600 font-semibold">— {todayWisdom.source}</footer>
          </blockquote>
        </CardContent>
      </Card>

      {/* Current Courses - In Progress */}
      {inProgressCourses.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressCourses.map((course) => {
              const courseProgressItems = userProgress.filter(p => p.course_id === course.id);
              const totalLessons = courseProgressItems.length;
              const completedInCourse = courseProgressItems.filter(p => p.completed).length;
              const progressPercent = totalLessons > 0 ? (completedInCourse / totalLessons) * 100 : 0;
              
              return (
                <Card key={course.id} className="hover:shadow-xl transition-shadow bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                        <p className="text-slate-600 text-sm line-clamp-2">{course.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                          <span>{completedInCourse} of {totalLessons} lessons</span>
                          <span className="font-semibold">{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                      <Link to={createPageUrl('CourseDetail') + '?id=' + course.id}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                          Continue Course
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-900">
            {inProgressCourses.length > 0 ? 'Explore More Courses' : 'Begin Your Journey'}
          </h2>
          <Link to={createPageUrl('Marketplace')}>
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses
              .filter(c => !inProgressCourseIds.includes(c.id))
              .slice(0, 3)
              .map((course) => (
                <CourseCard key={course.id} course={course} userTier={userTier} />
              ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-300">
            <BookOpen className="w-20 h-20 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-xl font-semibold">No courses available yet</p>
            <p className="text-slate-500 mt-2">New Torah content coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}