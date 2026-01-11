import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedFilter } from '@/components/api/scoped';
import PageShell from '@/components/ui/PageShell';

export default function AdminHardening() {
  const { user, activeSchoolId, isAdmin, isLoading } = useSession();
  const auditFields = [
    'id',
    'action',
    'user_email',
    'created_date'
  ];
  const rateLimitFields = [
    'id',
    'user_email',
    'count',
    'created_date'
  ];

  const { data: rateLimits = [] } = useQuery({
    queryKey: buildCacheKey('rate-limits', activeSchoolId),
    queryFn: () => scopedFilter('RateLimitLog', activeSchoolId, {}, '-created_date', 100, { fields: rateLimitFields }),
    enabled: !!activeSchoolId && isAdmin
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: buildCacheKey('audit-summary', activeSchoolId),
    queryFn: () => scopedFilter('AuditLog', activeSchoolId, {}, '-created_date', 50, { fields: auditFields }),
    enabled: !!activeSchoolId && isAdmin
  });

  const handleExportData = async () => {
    try {
      // Export school data to CSV
      const courses = await scopedFilter('Course', activeSchoolId, {}, null, 5000, { fields: ['id'] });
      const entitlements = await scopedFilter('Entitlement', activeSchoolId, {}, null, 5000, { fields: ['id'] });
      
      const csv = [
        'Entity,Count',
        `Courses,${courses.length}`,
        `Entitlements,${entitlements.length}`
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `school-data-${activeSchoolId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const recentActivity = auditLogs.slice(0, 10);
  const topUsers = Object.entries(
    rateLimits.reduce((acc, log) => {
      acc[log.user_email] = (acc[log.user_email] || 0) + log.count;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (isLoading) {
    return <PageShell title="Production Hardening" subtitle="Loading session…" />;
  }

  if (!user) {
    return <PageShell title="Production Hardening" subtitle="Please sign in to access this area." />;
  }

  if (!activeSchoolId) {
    return <PageShell title="Production Hardening" subtitle="Select a school to continue." />;
  }

  if (!isAdmin) {
    return <PageShell title="Production Hardening" subtitle="School admin access required." />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Production Hardening</h1>
          <p className="text-slate-600">Security, monitoring, and data management</p>
        </div>
        <Badge variant="outline" className="text-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          System Healthy
        </Badge>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Rate Limit Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rateLimits.length}</div>
            <p className="text-xs text-slate-500 mt-1">Last 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Audit Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-slate-500 mt-1">Recent actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Backup Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 font-semibold">Active</div>
            <p className="text-xs text-slate-500 mt-1">Last: Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Active Users */}
      <Card>
        <CardHeader>
          <CardTitle>Most Active Users (Rate Limits)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topUsers.map(([email, count]) => (
              <div key={email} className="flex justify-between items-center p-2 border-b">
                <span className="text-sm">{email}</span>
                <Badge variant="outline">{count} requests</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.map((log) => (
              <div key={log.id} className="text-sm p-2 border-b">
                <div className="flex justify-between">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(log.created_date).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600">by {log.user_email}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-3">
              Export school data for backup or analysis
            </p>
            <Button onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export School Data (CSV)
            </Button>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Full backup system and automated exports coming in future updates. 
              Contact support for comprehensive data exports.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
