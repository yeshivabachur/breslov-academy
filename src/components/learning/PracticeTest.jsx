import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Award, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PracticeTest({ courseId, onComplete }) {
  const [started, setStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes

  const testInfo = {
    title: 'Likutey Moharan Torah 1-10 Comprehensive Review',
    questions: 25,
    timeLimit: 45,
    passingScore: 75,
    topics: ['Azamra', 'Joy', 'Prayer', 'Simplicity', 'Faith'],
    difficulty: 'Intermediate'
  };

  const startTest = () => {
    setStarted(true);
    // Start timer
    const interval = setInterval(() => {
      setTimeRemaining(t => {
        if (t <= 0) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (started) {
    return (
      <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">📝</div>
          <div className="text-3xl font-black text-slate-900 mb-2">Test in Progress</div>
          <div className="text-5xl font-black text-blue-600 mb-4">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-slate-600">Time remaining</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardContent className="p-8 space-y-6">
        <div className="text-center">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-slate-900 mb-2">{testInfo.title}</h2>
          <Badge className="bg-blue-100 text-blue-800">
            {testInfo.difficulty}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{testInfo.questions}</div>
            <div className="text-xs text-slate-600">Questions</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{testInfo.timeLimit}</div>
            <div className="text-xs text-slate-600">Minutes</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold text-slate-700">Topics Covered</div>
          <div className="flex flex-wrap gap-2">
            {testInfo.topics.map((topic, idx) => (
              <Badge key={idx} variant="outline">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Passing Score:</strong> {testInfo.passingScore}% or higher
              <div className="mt-1">Earn up to 250 XP based on performance</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-900 font-serif leading-relaxed">
            ✅ <strong>Test Guidelines:</strong> Open notes allowed. Focus on understanding, not memorization. May Hashem grant you clarity!
          </div>
        </div>

        <Button
          onClick={startTest}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl py-6 text-lg"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Begin Test
        </Button>
      </CardContent>
    </Card>
  );
}