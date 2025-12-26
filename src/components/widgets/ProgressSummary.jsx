import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';

export default function ProgressSummary({ stats }) {
  const metrics = [
    { icon: TrendingUp, label: 'Progress', value: `${stats?.progress || 0}%`, color: 'text-blue-600' },
    { icon: Award, label: 'Avg Score', value: `${stats?.avgScore || 0}%`, color: 'text-purple-600' },
    { icon: Clock, label: 'Study Time', value: `${stats?.hours || 0}h`, color: 'text-green-600' },
    { icon: Target, label: 'Completed', value: `${stats?.completed || 0}`, color: 'text-amber-600' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <Card key={idx} className="glass-effect border-0 premium-shadow rounded-2xl">
            <CardContent className="p-6 text-center">
              <Icon className={`w-8 h-8 mx-auto mb-3 ${metric.color}`} />
              <div className="text-3xl font-black text-slate-900 mb-1">{metric.value}</div>
              <div className="text-xs text-slate-600">{metric.label}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}