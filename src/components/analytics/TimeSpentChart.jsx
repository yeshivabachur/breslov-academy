import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

export default function TimeSpentChart() {
  const data = [
    { date: 'Dec 19', minutes: 45 },
    { date: 'Dec 20', minutes: 62 },
    { date: 'Dec 21', minutes: 38 },
    { date: 'Dec 22', minutes: 75 },
    { date: 'Dec 23', minutes: 90 },
    { date: 'Dec 24', minutes: 55 },
    { date: 'Dec 25', minutes: 68 }
  ];

  const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0);
  const avgMinutes = Math.round(totalMinutes / data.length);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div>Study Time</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">זמן לימוד</div>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            {avgMinutes} min/day avg
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="minutes" 
              stroke="#3b82f6" 
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-900 font-serif">
            📈 You studied {totalMinutes} minutes this week - that's {Math.round(totalMinutes / 60)} hours of Torah learning!
          </div>
        </div>
      </CardContent>
    </Card>
  );
}