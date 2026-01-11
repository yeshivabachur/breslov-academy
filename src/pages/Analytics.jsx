import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3 } from 'lucide-react';
import StudentDashboard from '@/components/analytics/StudentDashboard';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedFilter } from '@/components/api/scoped';

export default function Analytics() {
  const { user, activeSchoolId, isLoading } = useSession();

  const { data: analytics = [] } = useQuery({
    queryKey: buildCacheKey('analytics', activeSchoolId, user?.email),
    queryFn: () => scopedFilter('Analytics', activeSchoolId, { user_email: user.email }),
    enabled: !!user?.email && !!activeSchoolId
  });

  const { data: progress = [] } = useQuery({
    queryKey: buildCacheKey('progress', activeSchoolId, user?.email),
    queryFn: () => scopedFilter('UserProgress', activeSchoolId, { user_email: user.email }),
    enabled: !!user?.email && !!activeSchoolId
  });

  const { data: courses = [] } = useQuery({
    queryKey: buildCacheKey('courses', activeSchoolId),
    queryFn: () => scopedFilter('Course', activeSchoolId, { is_published: true }),
    enabled: !!activeSchoolId
  });

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Learning Analytics</h1>
            <p className="text-slate-300 text-lg mt-1">Track your progress and insights</p>
          </div>
        </div>
      </div>

      <StudentDashboard analytics={analytics} progress={progress} courses={courses} />
    </div>
  );
}
