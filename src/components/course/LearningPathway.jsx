import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function LearningPathway({ pathway, userProgress = [] }) {
  const steps = [
    { id: 1, title: 'Hebrew Foundations', courseId: 'hebrew-101', duration: '2 weeks', completed: true },
    { id: 2, title: 'Biblical Hebrew', courseId: 'biblical-hebrew', duration: '4 weeks', completed: true },
    { id: 3, title: 'Torah Reading', courseId: 'torah-reading', duration: '3 weeks', completed: false, current: true },
    { id: 4, title: 'Talmudic Aramaic', courseId: 'aramaic-101', duration: '6 weeks', completed: false, locked: true },
    { id: 5, title: 'Advanced Studies', courseId: 'advanced-torah', duration: '8 weeks', completed: false, locked: true }
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const progressPercent = (completedSteps / steps.length) * 100;

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Map className="w-5 h-5 text-purple-600" />
            <div>
              <div>Learning Pathway</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">מסלול לימוד</div>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            {completedSteps} / {steps.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-slate-700">Overall Progress</span>
            <span className="text-slate-600">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
          
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="relative pl-12">
                <div className={`absolute left-0 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-lg ${
                  step.completed ? 'bg-green-600' :
                  step.current ? 'bg-blue-600 animate-pulse' :
                  'bg-slate-300'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : step.locked ? (
                    <Lock className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white font-bold">{idx + 1}</span>
                  )}
                </div>

                <div className={`p-4 rounded-xl border-2 ${
                  step.completed ? 'bg-green-50 border-green-200' :
                  step.current ? 'bg-blue-50 border-blue-300' :
                  'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-slate-900">{step.title}</div>
                      <div className="text-xs text-slate-600">{step.duration}</div>
                    </div>
                    {step.current && (
                      <Link to={createPageUrl(`CourseDetail?id=${step.courseId}`)}>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg">
                          Continue
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}