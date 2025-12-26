import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp, Clock, Target, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function StudyInsights({ userData }) {
  const insights = [
    {
      type: 'strength',
      icon: Award,
      color: 'from-green-500 to-emerald-600',
      title: 'Best Learning Time',
      insight: 'You retain 34% more when studying between 9-11 AM',
      action: 'Schedule important lessons in the morning'
    },
    {
      type: 'improvement',
      icon: Target,
      color: 'from-blue-500 to-indigo-600',
      title: 'Consistency Opportunity',
      insight: 'Studying at the same time daily improves retention by 28%',
      action: 'Set a fixed study time (Kvius Itim)'
    },
    {
      type: 'pattern',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      title: 'Learning Style',
      insight: 'You excel with video content over text-only lessons',
      action: 'Prioritize video shiurim for complex topics'
    },
    {
      type: 'recommendation',
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      title: 'Optimal Session Length',
      insight: 'Your engagement peaks at 25-30 minute study blocks',
      action: 'Use Pomodoro timer for focused learning'
    }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <div>
            <div>Personalized Insights</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">תובנות אישיות</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${insight.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="font-black text-slate-900 mb-1">{insight.title}</div>
                  <p className="text-sm text-slate-700 mb-2">{insight.insight}</p>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-blue-700 font-bold">
                      ✨ {insight.action}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
          <div className="font-bold text-purple-900 mb-3 font-serif">
            🎯 This Week's Focus
          </div>
          <div className="text-sm text-purple-800 space-y-2">
            <div>• Study Torah at your peak time (9-11 AM) for maximum retention</div>
            <div>• Complete 5 video lessons to maintain your learning momentum</div>
            <div>• Join a chavruta session to deepen understanding</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}