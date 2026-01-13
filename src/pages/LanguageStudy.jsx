import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageShell from '@/components/ui/PageShell';
import RosettaLesson from '@/components/language/RosettaLesson';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '@/lib/db';
import { toast } from 'sonner';

export default function LanguageStudy() {
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const variant = searchParams.get('variant') || 'hebrew';

  const handleComplete = (finalStreak) => {
    const xpEarned = finalStreak * 100;
    setFinished(true);
    setScore(xpEarned);
    
    // Persist progress
    db.addXP(xpEarned);
    toast.success(`+${xpEarned} XP Saved!`);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 space-y-6">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Lesson Complete!</h2>
              <p className="text-slate-500">You earned {score} XP</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => nav('/languagelearning')}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => window.location.reload()}>
                Next Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PageShell 
      title={`Learning ${variant}`} 
      subtitle="Visual Association Mode"
      actions={
        <Button variant="ghost" onClick={() => nav('/languagelearning')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit
        </Button>
      }
    >
      <RosettaLesson onComplete={handleComplete} />
    </PageShell>
  );
}