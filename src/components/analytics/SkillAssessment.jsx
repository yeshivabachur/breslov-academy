import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SkillAssessment({ subject }) {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const assessment = {
    subject: subject || 'Torah Hebrew',
    questions: 15,
    timeLimit: 20,
    topics: ['Vocabulary', 'Grammar', 'Reading Comprehension', 'Writing']
  };

  if (completed) {
    return (
      <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
        <CardContent className="p-12 text-center space-y-6">
          <Award className="w-24 h-24 text-amber-600 mx-auto" />
          <div>
            <div className="text-4xl font-black text-slate-900 mb-2">Assessment Complete!</div>
            <div className="text-xl text-amber-700 font-serif" dir="rtl">ההערכה הושלמה!</div>
          </div>
          <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-200">
            <div className="text-6xl font-black text-green-600 mb-2">85%</div>
            <div className="text-lg text-green-900 font-bold">Proficiency Level: Advanced</div>
          </div>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl">
            View Detailed Results
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Target className="w-5 h-5 text-blue-600" />
          Skill Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">{assessment.subject}</h3>
          <p className="text-slate-600">Test your knowledge and receive personalized recommendations</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <div className="text-3xl font-black text-slate-900">{assessment.questions}</div>
            <div className="text-sm text-slate-600">Questions</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <div className="text-3xl font-black text-slate-900">{assessment.timeLimit}</div>
            <div className="text-sm text-slate-600">Minutes</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold text-slate-700">Topics Covered</div>
          <div className="flex flex-wrap gap-2">
            {assessment.topics.map((topic, idx) => (
              <Badge key={idx} variant="outline">{topic}</Badge>
            ))}
          </div>
        </div>

        <Button
          onClick={() => setCompleted(true)}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl"
        >
          Begin Assessment
        </Button>
      </CardContent>
    </Card>
  );
}