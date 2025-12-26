import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

export default function ComparisonChart({ userData }) {
  const comparisonData = [
    { metric: 'Lessons', you: 24, avg: 18, top: 35 },
    { metric: 'Hours', you: 42, avg: 32, top: 68 },
    { metric: 'Quiz Avg', you: 87, avg: 76, top: 95 },
    { metric: 'Streak', you: 12, avg: 8, top: 28 }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <div>
            <div>Performance Comparison</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">השוואת ביצועים</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Badge className="bg-blue-100 text-blue-800">
            You
          </Badge>
          <Badge className="bg-slate-100 text-slate-800">
            <Users className="w-3 h-3 mr-1" />
            Class Average
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            Top 10%
          </Badge>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <XAxis dataKey="metric" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Legend />
            <Bar dataKey="you" fill="#3b82f6" name="You" radius={[8, 8, 0, 0]} />
            <Bar dataKey="avg" fill="#94a3b8" name="Average" radius={[8, 8, 0, 0]} />
            <Bar dataKey="top" fill="#10b981" name="Top 10%" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-4">
          {comparisonData.map((item, idx) => {
            const aboveAvg = item.you > item.avg;
            const percentile = ((item.you / item.top) * 100).toFixed(0);
            
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border ${
                  aboveAvg 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}
              >
                <div className="text-sm font-bold text-slate-900 mb-1">{item.metric}</div>
                <div className={`text-xs ${aboveAvg ? 'text-green-800' : 'text-orange-800'}`}>
                  {aboveAvg ? '↑' : '↓'} {Math.abs(((item.you - item.avg) / item.avg * 100)).toFixed(0)}% vs avg
                </div>
                <Badge variant="outline" className="text-xs mt-1">
                  Top {percentile}%
                </Badge>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-900 font-serif leading-relaxed">
            🎯 You're performing above average in most areas! Focus on increasing your study streak to reach top 10% status.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}