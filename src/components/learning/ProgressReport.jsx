import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function ProgressReport({ studentData }) {
  const report = {
    period: 'Last 30 Days',
    lessonsCompleted: 24,
    hoursStudied: 42.5,
    averageScore: 87,
    streak: 18,
    topCourse: 'Likutey Moharan',
    improvement: '+15%',
    strengths: ['Torah Hebrew', 'Chassidus', 'Consistent Study'],
    areasToImprove: ['Aramaic Grammar', 'Talmud Terminology']
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <div>Progress Report</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">דוח התקדמות</div>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            {report.period}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <div className="text-3xl font-black text-slate-900">{report.lessonsCompleted}</div>
            <div className="text-sm text-slate-600">Lessons</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <div className="text-3xl font-black text-slate-900">{report.hoursStudied}</div>
            <div className="text-sm text-slate-600">Hours</div>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <div className="text-3xl font-black text-slate-900">{report.averageScore}%</div>
            <div className="text-sm text-slate-600">Avg Score</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
            <div className="text-3xl font-black text-slate-900">{report.streak}</div>
            <div className="text-sm text-slate-600">Day Streak</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-sm font-bold text-green-900 mb-2">✨ Strengths</div>
            <div className="flex flex-wrap gap-2">
              {report.strengths.map((strength, idx) => (
                <Badge key={idx} className="bg-green-100 text-green-800">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="text-sm font-bold text-amber-900 mb-2">🎯 Growth Areas</div>
            <div className="flex flex-wrap gap-2">
              {report.areasToImprove.map((area, idx) => (
                <Badge key={idx} className="bg-amber-100 text-amber-800">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl">
            <Mail className="w-4 h-4 mr-2" />
            Email Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}