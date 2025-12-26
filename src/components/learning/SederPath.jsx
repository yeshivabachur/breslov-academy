import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Lock, BookOpen, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SederPath({ seder, courses, userProgress }) {
  const getNodeStatus = (course, idx) => {
    if (userProgress?.completedCourses?.includes(course.id)) return 'completed';
    if (idx === 0) return 'available';
    
    const prevCourse = courses[idx - 1];
    if (userProgress?.completedCourses?.includes(prevCourse.id)) return 'available';
    
    return 'locked';
  };

  const totalDapim = courses.reduce((sum, c) => sum + (c.total_dapim || 0), 0);
  const completedDapim = courses
    .filter(c => userProgress?.completedCourses?.includes(c.id))
    .reduce((sum, c) => sum + (c.total_dapim || 0), 0);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] overflow-hidden">
      {/* Header */}
      <div className="p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <Badge className="bg-white/20 text-white mb-3 font-serif">Seder {seder.order}</Badge>
          <h2 className="text-4xl font-black text-white mb-2 font-serif">{seder.name}</h2>
          <p className="text-blue-200 font-serif">{seder.description}</p>
          
          <div className="mt-6 flex items-center gap-6">
            <div>
              <div className="text-3xl font-black text-white">{completedDapim}/{totalDapim}</div>
              <div className="text-sm text-blue-200">Dapim Completed</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">
                {userProgress?.completedCourses?.filter(id => courses.find(c => c.id === id)).length || 0}/{courses.length}
              </div>
              <div className="text-sm text-blue-200">Courses</div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-8">
        {/* Visual Learning Path */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-slate-200" />

          <div className="space-y-6">
            {courses.map((course, idx) => {
              const status = getNodeStatus(course, idx);
              const Icon = 
                status === 'completed' ? CheckCircle :
                status === 'locked' ? Lock : Circle;
              
              const colors = {
                completed: 'from-green-500 to-emerald-600',
                available: 'from-blue-500 to-indigo-600',
                locked: 'from-slate-300 to-slate-400'
              };

              const dafProgress = course.current_daf 
                ? `Daf ${course.current_daf}/${course.total_dapim}` 
                : null;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-20"
                >
                  {/* Node */}
                  <div className={`absolute left-0 w-16 h-16 bg-gradient-to-br ${colors[status]} rounded-2xl flex items-center justify-center z-10 shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Course Card */}
                  <Link to={status !== 'locked' ? createPageUrl(`CourseDetail?id=${course.id}`) : '#'}>
                    <div className={`p-6 rounded-2xl transition-all ${
                      status === 'available' 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 hover:shadow-xl cursor-pointer' 
                        : status === 'completed'
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-slate-50 opacity-60 border-2 border-slate-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-black text-lg text-slate-900 font-serif mb-1">
                            {course.title}
                          </h3>
                          {course.title_hebrew && (
                            <div className="text-amber-700 font-serif mb-2" dir="rtl">
                              {course.title_hebrew}
                            </div>
                          )}
                          <p className="text-sm text-slate-600 font-serif">
                            {course.description}
                          </p>
                        </div>
                        {status === 'available' && (
                          <Badge className="bg-blue-600 text-white ml-4 font-serif">Start</Badge>
                        )}
                      </div>

                      {dafProgress && (
                        <div className="mt-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-slate-600" />
                          <span className="text-sm text-slate-600 font-serif">{dafProgress}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Completion Certificate */}
        {completedDapim === totalDapim && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl text-center"
          >
            <Award className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h4 className="text-2xl font-black text-slate-900 mb-2 font-serif">
              Siyum Complete!
            </h4>
            <p className="text-slate-600 mb-4 font-serif">
              You have completed {seder.name}
            </p>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl font-serif">
              <Award className="w-4 h-4 mr-2" />
              Download Certificate
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}