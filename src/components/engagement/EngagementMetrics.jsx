import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Eye, MousePointer, Clock, MessageCircle, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EngagementMetrics({ metrics }) {
  const engagementScore = metrics?.engagement_score || 0;
  const scoreColor = 
    engagementScore >= 80 ? 'from-green-500 to-green-600' :
    engagementScore >= 60 ? 'from-blue-500 to-blue-600' :
    engagementScore >= 40 ? 'from-yellow-500 to-yellow-600' :
    'from-red-500 to-red-600';

  const metricsList = [
    { label: 'Watch Time', value: `${metrics?.watch_time_minutes || 0} min`, icon: Clock },
    { label: 'Interactions', value: metrics?.interaction_count || 0, icon: MousePointer },
    { label: 'Forum Posts', value: metrics?.forum_posts || 0, icon: MessageCircle },
    { label: 'Quiz Attempts', value: metrics?.quiz_attempts || 0, icon: Target }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          Engagement Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
          <div className="text-sm text-slate-600 mb-2">Engagement Score</div>
          <div className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${scoreColor} mb-3`}>
            {engagementScore}
          </div>
          <Progress value={engagementScore} className="h-3" />
          <div className="text-sm text-slate-600 mt-2">
            {engagementScore >= 80 ? 'Highly Engaged!' : 
             engagementScore >= 60 ? 'Good Engagement' :
             engagementScore >= 40 ? 'Moderate' : 'Needs Improvement'}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metricsList.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="p-4 bg-white rounded-xl text-center">
                  <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-black text-slate-900">{metric.value}</div>
                  <div className="text-xs text-slate-600">{metric.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="p-4 bg-amber-50 rounded-xl">
          <p className="text-sm text-amber-900">
            <strong>Tip:</strong> Stay engaged by participating in discussions, completing quizzes, and taking notes to improve your retention and understanding.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}