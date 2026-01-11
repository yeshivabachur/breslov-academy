import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, TrendingUp } from 'lucide-react';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedFilter } from '@/components/api/scoped';

export default function AdaptiveLearning() {
  const { user, activeSchoolId } = useSession();

  const { data: adaptiveData = [] } = useQuery({
    queryKey: buildCacheKey('adaptive-learning', activeSchoolId, user?.email),
    queryFn: () => scopedFilter('AdaptiveLearning', activeSchoolId, { user_email: user.email }),
    enabled: !!user?.email && !!activeSchoolId
  });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <Brain className="w-16 h-16" />
          <div>
            <h1 className="text-4xl font-bold mb-2">Adaptive Learning</h1>
            <p className="text-purple-200 text-lg">AI-powered personalized learning paths</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">Learning Style</h3>
            <p className="text-2xl font-bold text-blue-600">Visual</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">Optimal Pace</h3>
            <p className="text-2xl font-bold text-green-600">Fast</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">Success Rate</h3>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-2xl font-bold text-green-600">87%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
