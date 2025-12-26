import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Award, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function TeamDashboard({ teamId }) {
  const teamStats = {
    members: 24,
    avgProgress: 72,
    totalHours: 456,
    coursesCompleted: 18,
    topPerformer: 'Moshe L.',
    teamGoal: 85
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <div>Team Dashboard</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">לוח צוות</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-3">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <Users className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{teamStats.members}</div>
            <div className="text-xs text-slate-600">Members</div>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{teamStats.avgProgress}%</div>
            <div className="text-xs text-slate-600">Avg Progress</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{teamStats.coursesCompleted}</div>
            <div className="text-xs text-slate-600">Completed</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <Award className="w-5 h-5 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{teamStats.totalHours}</div>
            <div className="text-xs text-slate-600">Hours</div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
          <div className="flex justify-between mb-3">
            <div className="text-sm font-bold text-slate-900">Team Goal Progress</div>
            <span className="text-sm text-slate-600">{teamStats.avgProgress}% / {teamStats.teamGoal}%</span>
          </div>
          <Progress value={(teamStats.avgProgress / teamStats.teamGoal) * 100} className="h-3" />
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <div>
              <div className="font-bold text-amber-900">Top Performer</div>
              <div className="text-sm text-amber-800">{teamStats.topPerformer}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}