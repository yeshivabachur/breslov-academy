import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BookOpen, Award, MessageCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function RecentActivity({ activities = [] }) {
  const defaultActivities = [
    {
      type: 'lesson_complete',
      title: 'Completed "Understanding Azamra"',
      time: new Date(Date.now() - 1800000),
      xp: 50
    },
    {
      type: 'achievement',
      title: 'Earned "Weekly Warrior" badge',
      time: new Date(Date.now() - 3600000),
      xp: 100
    },
    {
      type: 'discussion',
      title: 'Posted in Likutey Moharan discussion',
      time: new Date(Date.now() - 7200000),
      xp: 10
    },
    {
      type: 'quiz',
      title: 'Scored 95% on Torah 1 quiz',
      time: new Date(Date.now() - 10800000),
      xp: 75
    }
  ];

  const activeActivities = activities.length > 0 ? activities : defaultActivities;

  const getIcon = (type) => {
    switch(type) {
      case 'lesson_complete': return { Icon: CheckCircle, color: 'text-green-600' };
      case 'achievement': return { Icon: Award, color: 'text-amber-600' };
      case 'discussion': return { Icon: MessageCircle, color: 'text-blue-600' };
      case 'quiz': return { Icon: BookOpen, color: 'text-purple-600' };
      default: return { Icon: Activity, color: 'text-slate-600' };
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Activity className="w-5 h-5 text-blue-600" />
          <div>
            <div>Recent Activity</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">פעילות אחרונה</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeActivities.map((activity, idx) => {
          const { Icon, color } = getIcon(activity.type);
          
          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all"
            >
              <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">{activity.title}</div>
                <div className="text-xs text-slate-600">
                  {activity.time.toLocaleDateString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>
              {activity.xp && (
                <Badge className="bg-amber-100 text-amber-800 text-xs">
                  +{activity.xp} XP
                </Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}