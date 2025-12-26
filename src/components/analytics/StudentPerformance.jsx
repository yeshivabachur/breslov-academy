import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award } from 'lucide-react';

export default function StudentPerformance({ studentEmail }) {
  const performanceData = [
    { week: 'Week 1', score: 75 },
    { week: 'Week 2', score: 82 },
    { week: 'Week 3', score: 78 },
    { week: 'Week 4', score: 88 },
    { week: 'Week 5', score: 92 },
    { week: 'Week 6', score: 95 },
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Performance Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-slate-900">
              {performanceData[performanceData.length - 1].score}%
            </div>
            <div className="text-sm text-slate-600">Latest Score</div>
          </div>
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <Award className="w-3 h-3" />
            Improving
          </Badge>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="week" stroke="#64748b" />
            <YAxis stroke="#64748b" domain={[0, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}