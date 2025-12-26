import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function MilestoneTracker({ milestones = [] }) {
  const defaultMilestones = [
    { id: 1, name: 'Complete 5 Lessons', progress: 5, target: 5, reward: '50 XP', completed: true },
    { id: 2, name: 'Maintain 7-Day Streak', progress: 4, target: 7, reward: '100 XP', completed: false },
    { id: 3, name: 'Score 90%+ on Quiz', progress: 1, target: 3, reward: '150 XP', completed: false }
  ];

  const active = milestones.length > 0 ? milestones : defaultMilestones;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Target className="w-5 h-5 text-purple-600" />
          Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {active.map((milestone, idx) => {
          const progressPercent = (milestone.progress / milestone.target) * 100;
          
          return (
            <div
              key={milestone.id}
              className={`p-4 rounded-xl border-2 ${
                milestone.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{milestone.name}</div>
                  <div className="text-xs text-slate-600">Reward: {milestone.reward}</div>
                </div>
                {milestone.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Badge variant="outline">
                    {milestone.progress}/{milestone.target}
                  </Badge>
                )}
              </div>

              {!milestone.completed && (
                <Progress value={progressPercent} className="h-2 mt-2" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}