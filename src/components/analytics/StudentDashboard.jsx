import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BookOpen, Award, Clock, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function StudentDashboard({ studentData }) {
  const stats = {
    coursesEnrolled: 5,
    coursesCompleted: 2,
    avgProgress: 68,
    totalHours: 127,
    currentStreak: 18,
    avgScore: 87,
    rank: 'Scholar',
    nextRank: 'Sage'
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="font-serif">
            <div className="text-2xl">My Dashboard</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">לוח הבקרה שלי</div>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            {stats.rank}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{stats.coursesEnrolled}</div>
            <div className="text-xs text-slate-600">Courses</div>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <Award className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{stats.avgScore}%</div>
            <div className="text-xs text-slate-600">Avg Score</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <Clock className="w-5 h-5 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{stats.totalHours}</div>
            <div className="text-xs text-slate-600">Hours</div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-purple-700 mb-1">Progress to {stats.nextRank}</div>
              <div className="text-3xl font-black text-slate-900">{stats.avgProgress}%</div>
            </div>
            <Target className="w-10 h-10 text-purple-600" />
          </div>
          <Progress value={stats.avgProgress} className="h-3" />
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <TrendingUp className="w-5 h-5 text-blue-600 mb-2" />
          <div className="text-sm text-blue-900 font-serif">
            You're in the top 20% of learners this month! Keep up the excellent work.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}