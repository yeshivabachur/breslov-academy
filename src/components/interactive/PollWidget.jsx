import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PollWidget({ question, options }) {
  const [voted, setVoted] = useState(null);

  const samplePoll = {
    question: question || 'What time do you prefer for live shiurim?',
    questionHebrew: 'מתי אתה מעדיף שיעורים חיים?',
    options: options || [
      { text: 'Morning (6-9 AM)', votes: 45 },
      { text: 'Afternoon (2-5 PM)', votes: 23 },
      { text: 'Evening (7-10 PM)', votes: 89 },
      { text: 'Night (9 PM+)', votes: 34 }
    ]
  };

  const totalVotes = samplePoll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <Badge className="bg-purple-100 text-purple-800">Community Poll</Badge>
        </div>

        <div>
          <div className="font-bold text-slate-900 mb-2">{samplePoll.question}</div>
          <div className="text-sm text-amber-700 font-serif" dir="rtl">
            {samplePoll.questionHebrew}
          </div>
        </div>

        <div className="space-y-2">
          {samplePoll.options.map((option, idx) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isSelected = voted === idx;
            
            return (
              <Button
                key={idx}
                onClick={() => setVoted(idx)}
                disabled={voted !== null}
                variant="outline"
                className={`w-full p-4 rounded-xl text-left justify-start ${
                  isSelected ? 'bg-blue-100 border-blue-500' : ''
                }`}
              >
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{option.text}</span>
                    {voted !== null && (
                      <span className="text-sm">{Math.round(percentage)}%</span>
                    )}
                  </div>
                  {voted !== null && (
                    <Progress value={percentage} className="h-2" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {voted !== null && (
          <div className="text-sm text-slate-600 text-center">
            {totalVotes} total votes
          </div>
        )}
      </CardContent>
    </Card>
  );
}