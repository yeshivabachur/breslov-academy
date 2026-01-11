import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedFilter } from '@/components/api/scoped';
import PageShell from '@/components/ui/PageShell';

export default function SchoolAnalytics() {
  const { user, activeSchoolId, isAdmin, isLoading } = useSession();
  const metricFields = [
    'id',
    'date',
    'enrollments_count',
    'lessons_completed_count',
    'revenue_cents',
    'avg_completion_rate',
    'active_users_count'
  ];
  const courseFields = [
    'id',
    'title',
    'status'
  ];
  const entitlementFields = [
    'id',
    'course_id',
    'entitlement_type',
    'type'
  ];
  const progressFields = [
    'id',
    'course_id',
    'completed'
  ];

  const { data: metrics = [] } = useQuery({
    queryKey: buildCacheKey('school-metrics', activeSchoolId),
    queryFn: () => scopedFilter(
      'SchoolMetricDaily',
      activeSchoolId,
      {},
      '-date',
      30,
      { fields: metricFields }
    ),
    enabled: !!activeSchoolId && isAdmin
  });

  const { data: courses = [] } = useQuery({
    queryKey: buildCacheKey('courses', activeSchoolId),
    queryFn: () => scopedFilter('Course', activeSchoolId, {}, null, 1000, { fields: courseFields }),
    enabled: !!activeSchoolId && isAdmin
  });

  const { data: entitlements = [] } = useQuery({
    queryKey: buildCacheKey('entitlements', activeSchoolId),
    queryFn: () => scopedFilter('Entitlement', activeSchoolId, {}, null, 2000, { fields: entitlementFields }),
    enabled: !!activeSchoolId && isAdmin
  });

  const { data: progress = [] } = useQuery({
    queryKey: buildCacheKey('all-progress', activeSchoolId),
    queryFn: () => scopedFilter('UserProgress', activeSchoolId, {}, null, 5000, { fields: progressFields }),
    enabled: !!activeSchoolId && isAdmin
  });

  if (isLoading) {
    return <PageShell title="School Analytics" subtitle="Loading session…" />;
  }

  if (!user) {
    return <PageShell title="School Analytics" subtitle="Please sign in to view analytics." />;
  }

  if (!activeSchoolId) {
    return <PageShell title="School Analytics" subtitle="Select a school to view analytics." />;
  }

  if (!isAdmin) {
    return <PageShell title="School Analytics" subtitle="School admin access required." />;
  }

  const latestMetric = metrics[0] || {};
  const totalRevenue = metrics.reduce((sum, m) => sum + (m.revenue_cents || 0), 0);
  const avgCompletion = metrics.length > 0 
    ? metrics.reduce((sum, m) => sum + (m.avg_completion_rate || 0), 0) / metrics.length 
    : 0;

  const chartData = [...metrics].reverse().map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    enrollments: m.enrollments_count,
    completions: m.lessons_completed_count,
    revenue: m.revenue_cents / 100
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">School Analytics</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Active Learners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latestMetric.active_users_count || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Total Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{entitlements.length}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgCompletion.toFixed(1)}%</div>
            <p className="text-xs text-slate-500 mt-1">30-day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(totalRevenue / 100).toFixed(0)}</div>
            <p className="text-xs text-slate-500 mt-1">30-day total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enrollments Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completions" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Top Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Course</th>
                  <th className="text-right py-3 px-4">Enrollments</th>
                  <th className="text-right py-3 px-4">Completion</th>
                  <th className="text-right py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  const courseEnrollments = entitlements.filter(
                    e => e.entitlement_type === 'COURSE' && e.course_id === course.id
                  ).length;
                  const courseProgress = progress.filter(p => p.course_id === course.id);
                  const completionRate = courseProgress.length > 0
                    ? (courseProgress.filter(p => p.completed).length / courseProgress.length * 100)
                    : 0;

                  return (
                    <tr key={course.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{course.title}</td>
                      <td className="text-right py-3 px-4">{courseEnrollments}</td>
                      <td className="text-right py-3 px-4">{completionRate.toFixed(0)}%</td>
                      <td className="text-right py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          course.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
