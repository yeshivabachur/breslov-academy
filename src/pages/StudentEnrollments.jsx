import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Award, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function StudentEnrollments() {
  const [user, setUser] = useState(null);

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

  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments', user?.email],
    queryFn: () => base44.entities.CourseRegistration.filter({ user_email: user.email }),
    enabled: !!user?.email
  });

  const { data: allCourses = [] } = useQuery({
    queryKey: ['all-courses'],
    queryFn: () => base44.entities.Course.list()
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ['all-progress', user?.email],
    queryFn: () => base44.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user?.email
  });

  const enrolledCourses = enrollments.map(enrollment => {
    const course = allCourses.find(c => c.id === enrollment.course_id);
    const progress = userProgress.filter(p => p.course_id === enrollment.course_id);
    const completedLessons = progress.filter(p => p.completed).length;
    const totalLessons = progress.length || 1;
    const percentage = (completedLessons / totalLessons) * 100;

    return {
      ...course,
      enrollmentDate: enrollment.created_date,
      progress: percentage,
      completedLessons,
      totalLessons
    };
  }).filter(c => c.id);

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 mb-2">My Enrollments</h1>
          <p className="text-slate-600 text-lg">Continue your learning journey</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link to={createPageUrl(`CourseDetail?id=${course.id}`)}>
                <Card className="card-modern border-white/60 premium-shadow hover:premium-shadow-lg transition-all rounded-[2rem] overflow-hidden cursor-pointer h-full">
                  <div className="h-40 bg-gradient-to-br from-slate-900 to-blue-900 relative">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-blue-500 text-white">
                      {Math.round(course.progress)}% Complete
                    </Badge>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Progress</span>
                        <span className="font-bold text-slate-900">{course.completedLessons} / {course.totalLessons} lessons</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl btn-premium">
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}

          {enrolledCourses.length === 0 && (
            <div className="col-span-full">
              <Card className="glass-effect border-2 border-dashed border-slate-300 rounded-[2rem]">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No enrollments yet</h3>
                  <p className="text-slate-600 mb-6">Browse our course library and start learning</p>
                  <Link to={createPageUrl('Courses')}>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl">
                      Browse Courses
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}