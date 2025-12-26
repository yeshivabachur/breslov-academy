import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Breslov Academy',
      titleHebrew: 'ברוכים הבאים',
      description: 'Your journey into Torah wisdom begins here',
      action: 'Get Started'
    },
    {
      title: 'Choose Your Learning Path',
      titleHebrew: 'בחר את מסלול הלימוד',
      description: 'Select topics that interest you most',
      action: 'Continue'
    },
    {
      title: 'Set Your Goals',
      titleHebrew: 'הגדר את היעדים',
      description: 'How much time can you dedicate daily?',
      action: 'Continue'
    },
    {
      title: 'Ready to Learn!',
      titleHebrew: 'מוכן ללמוד!',
      description: 'Everything is set up. Begin your first lesson.',
      action: 'Start Learning'
    }
  ];

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="glass-effect border-0 premium-shadow-xl rounded-[3rem] max-w-2xl w-full">
        <CardContent className="p-12 space-y-8">
          <div className="text-center space-y-4">
            <Badge className="bg-blue-100 text-blue-800">
              Step {step + 1} of {steps.length}
            </Badge>
            <h1 className="text-5xl font-black text-slate-900">{currentStep.title}</h1>
            <div className="text-2xl text-amber-700 font-serif" dir="rtl">
              {currentStep.titleHebrew}
            </div>
            <p className="text-xl text-slate-600">{currentStep.description}</p>
          </div>

          <Progress value={progress} className="h-3" />

          <div className="flex gap-4">
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                size="lg"
                className="flex-1 rounded-2xl"
              >
                Back
              </Button>
            )}
            <Button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  onComplete?.();
                }
              }}
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl"
            >
              {currentStep.action}
              {step === steps.length - 1 ? <CheckCircle className="w-5 h-5 ml-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}