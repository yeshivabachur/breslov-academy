import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedFilter } from '@/components/api/scoped';

export default function CohortDetail() {
  const { activeSchoolId } = useSession();
  
  const urlParams = new URLSearchParams(window.location.search);
  const cohortId = urlParams.get('id');

  const { data: cohort } = useQuery({
    queryKey: buildCacheKey('cohort', activeSchoolId, cohortId),
    queryFn: async () => {
      const cohorts = await scopedFilter('Cohort', activeSchoolId, { id: cohortId });
      return cohorts[0];
    },
    enabled: !!cohortId && !!activeSchoolId
  });

  const { data: course } = useQuery({
    queryKey: buildCacheKey('course', activeSchoolId, cohort?.course_id),
    queryFn: async () => {
      const courses = await scopedFilter('Course', activeSchoolId, { id: cohort.course_id });
      return courses[0];
    },
    enabled: !!cohort?.course_id && !!activeSchoolId
  });

  const { data: schedule = [] } = useQuery({
    queryKey: buildCacheKey('cohort-schedule', activeSchoolId, cohortId),
    queryFn: () => scopedFilter('CohortScheduleItem', activeSchoolId, {
      cohort_id: cohortId
    }, 'week_number'),
    enabled: !!cohortId && !!activeSchoolId
  });

  const { data: members = [] } = useQuery({
    queryKey: buildCacheKey('cohort-members', activeSchoolId, cohortId),
    queryFn: () => scopedFilter('CohortMember', activeSchoolId, {
      cohort_id: cohortId
    }),
    enabled: !!cohortId && !!activeSchoolId
  });

  if (!cohort) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const currentWeek = Math.ceil((new Date() - new Date(cohort.start_date)) / (7 * 24 * 60 * 60 * 1000));
  const totalWeeks = Math.ceil((new Date(cohort.end_date) - new Date(cohort.start_date)) / (7 * 24 * 60 * 60 * 1000));
  const progressPercent = Math.min((currentWeek / totalWeeks) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <Badge className="mb-3">{cohort.status}</Badge>
        <h1 className="text-3xl font-bold mb-2">{cohort.name}</h1>
        <p className="text-slate-300">
          {new Date(cohort.start_date).toLocaleDateString()} - {new Date(cohort.end_date).toLocaleDateString()}
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Week {currentWeek} of {totalWeeks}</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercent} className="bg-slate-700" />
        </div>
      </div>

      {/* Course Info */}
      {course && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{course.title}</h3>
                <p className="text-sm text-slate-600">Instructor: {cohort.instructor_user}</p>
              </div>
              <Link to={createPageUrl(`CourseDetail?id=${course.id}`)}>
                <Button variant="outline">View Course</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedule.map((item) => {
              const isPast = item.week_number < currentWeek;
              const isCurrent = item.week_number === currentWeek;
              
              return (
                <div 
                  key={item.id} 
                  className={`p-4 border rounded-lg ${isCurrent ? 'border-amber-500 bg-amber-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={isPast ? 'secondary' : 'default'}>
                          Week {item.week_number}
                        </Badge>
                        {isCurrent && <Badge className="bg-amber-500">Current</Badge>}
                      </div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Due: {new Date(item.due_at).toLocaleDateString()}
                      </p>
                    </div>
                    {isPast && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {!isPast && <Clock className="w-5 h-5 text-slate-400" />}
                  </div>
                  
                  {item.lesson_id && (
                    <Link to={createPageUrl(`LessonViewerPremium?id=${item.lesson_id}`)} className="mt-3 block">
                      <Button size="sm" variant="outline" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Go to Lesson
                      </Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle>Cohort Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {members.slice(0, 10).map((member) => (
              <div key={member.id} className="flex items-center justify-between p-2 border-b">
                <span className="text-sm">{member.user_email}</span>
                <Badge variant="outline">{member.role}</Badge>
              </div>
            ))}
            {members.length > 10 && (
              <p className="text-xs text-slate-500 text-center pt-2">
                +{members.length - 10} more members
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
