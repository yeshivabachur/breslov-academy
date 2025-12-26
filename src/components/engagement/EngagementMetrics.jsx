import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function EngagementMetrics({ courseId }) {
  const metrics = {
    views: 1247,
    likes: 89,
    comments: 156,
    completionRate: 78,
    avgTimeSpent: 42
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Activity className="w-5 h-5 text-blue-600" />
          Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <Eye className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{metrics.views}</div>
            <div className="text-xs text-slate-600">Views</div>
          </div>
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-center">
            <ThumbsUp className="w-5 h-5 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{metrics.likes}</div>
            <div className="text-xs text-slate-600">Likes</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <MessageCircle className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{metrics.comments}</div>
            <div className="text-xs text-slate-600">Comments</div>
          </div>
          <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-center">
            <div className="text-2xl font-black text-green-600">{metrics.completionRate}%</div>
            <div className="text-xs text-slate-600">Completion</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-700">Student engagement</span>
            <span className="font-bold text-slate-900">High</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}