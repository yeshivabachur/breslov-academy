import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Plus, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export default function StudyGoals() {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Complete 5 lessons this week', progress: 3, target: 5 },
    { id: 2, text: 'Maintain 7-day streak', progress: 5, target: 7 },
    { id: 3, text: 'Master 50 Hebrew words', progress: 32, target: 50 }
  ]);
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, {
        id: Date.now(),
        text: newGoal,
        progress: 0,
        target: 10
      }]);
      setNewGoal('');
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Target className="w-5 h-5 text-green-600" />
          <div>
            <div>My Goals</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">המטרות שלי</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add new goal..."
            className="flex-1 rounded-xl"
          />
          <Button
            onClick={addGoal}
            className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {goals.map((goal) => {
            const percentage = (goal.progress / goal.target) * 100;
            const isComplete = percentage >= 100;
            
            return (
              <div
                key={goal.id}
                className={`p-4 rounded-xl border-2 ${
                  isComplete 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{goal.text}</div>
                    <div className="text-xs text-slate-600">
                      {goal.progress} / {goal.target}
                    </div>
                  </div>
                  {isComplete ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
                
                {!isComplete && (
                  <Progress value={percentage} className="h-2" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}