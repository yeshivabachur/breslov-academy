import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LearningInsights({ userData }) {
  const insights = [
    {
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      title: 'Peak Performance',
      insight: 'You learn best between 9-11 AM',
      action: 'Schedule important lessons in morning'
    },
    {
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'Optimal Sessions',
      insight: 'Your sweet spot is 25-minute study blocks',
      action: 'Use Pomodoro timer for focus'
    },
    {
      icon: Star,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      title: 'Strength Areas',
      insight: 'You excel in Hebrew and Chassidus',
      action: 'Build on these foundations'
    }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <div>
            <div>Learning Insights</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">תובנות לימוד</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          
          return (
            <div
              key={idx}
              className={`p-4 ${insight.bg} rounded-xl border ${insight.border}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-6 h-6 ${insight.color} mt-0.5`} />
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">{insight.title}</div>
                  <p className="text-sm text-slate-700 mb-2">{insight.insight}</p>
                  <div className="text-xs text-blue-700 font-bold">
                    💡 {insight.action}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}