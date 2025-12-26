import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CourseRecommendations({ userProfile }) {
  const recommendations = [
    {
      courseId: 'advanced-azamra',
      title: 'Advanced Azamra Studies',
      reason: 'Based on your interest in Likutey Moharan',
      match: 95,
      level: 'Intermediate'
    },
    {
      courseId: 'aramaic-talmud',
      title: 'Talmudic Aramaic',
      reason: 'Complements your Hebrew studies',
      match: 88,
      level: 'Advanced'
    },
    {
      courseId: 'hitbodedut-practice',
      title: 'Hitbodedut in Practice',
      reason: 'Perfect for your spiritual growth path',
      match: 92,
      level: 'Beginner'
    }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <div>
            <div>Recommended for You</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">מומלץ עבורך</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-purple-300 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-bold text-slate-900 mb-1">{rec.title}</div>
                <div className="text-xs text-purple-600 mb-2">{rec.reason}</div>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {rec.level}
                </Badge>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {rec.match}% match
              </Badge>
            </div>

            <Link to={createPageUrl(`CourseDetail?id=${rec.courseId}`)}>
              <Button
                size="sm"
                className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Course
              </Button>
            </Link>
          </div>
        ))}

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="text-sm text-purple-900 font-serif">
            🤖 AI analyzes your learning patterns to suggest the perfect next steps
          </div>
        </div>
      </CardContent>
    </Card>
  );
}