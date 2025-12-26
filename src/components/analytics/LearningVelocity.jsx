import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function LearningVelocity() {
  const velocityData = [
    { week: 'Week 1', lessonsPerDay: 1.2, hoursPerDay: 0.8 },
    { week: 'Week 2', lessonsPerDay: 1.8, hoursPerDay: 1.3 },
    { week: 'Week 3', lessonsPerDay: 2.3, hoursPerDay: 1.7 },
    { week: 'Week 4', lessonsPerDay: 2.1, hoursPerDay: 1.5 },
    { week: 'Week 5', lessonsPerDay: 2.8, hoursPerDay: 2.1 },
    { week: 'Week 6', lessonsPerDay: 3.2, hoursPerDay: 2.4 }
  ];

  const currentVelocity = 3.2;
  const previousVelocity = 2.8;
  const change = ((currentVelocity - previousVelocity) / previousVelocity * 100).toFixed(1);
  const isIncrease = change > 0;

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Zap className="w-5 h-5 text-purple-600" />
            <div>
              <div>Learning Velocity</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">מהירות לימוד</div>
            </div>
          </div>
          <Badge className={isIncrease ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {isIncrease ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(change)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <div className="text-4xl font-black text-purple-600">{currentVelocity}</div>
            <div className="text-sm text-slate-600">Lessons/Day</div>
            <div className="text-xs text-slate-500 mt-1">Current pace</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <div className="text-4xl font-black text-blue-600">{velocityData[velocityData.length - 1].hoursPerDay}</div>
            <div className="text-sm text-slate-600">Hours/Day</div>
            <div className="text-xs text-slate-500 mt-1">Study time</div>
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-700 mb-3">6-Week Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={velocityData}>
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="lessonsPerDay" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="font-bold text-green-900 mb-1">Projected Completion</div>
              <div className="text-sm text-green-800">
                At your current pace, you'll complete the entire course in <strong>3.2 weeks</strong> - {isIncrease ? 'ahead of schedule!' : 'right on track!'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="text-sm text-purple-900 font-serif leading-relaxed">
            💡 Your learning velocity has increased {Math.abs(change)}% this week! 
            {isIncrease 
              ? ' Outstanding dedication to Torah study!' 
              : ' Consider setting daily study goals to maintain momentum.'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}