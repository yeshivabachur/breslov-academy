import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export default function StreakDisplay({ currentStreak = 0, longestStreak = 0 }) {
  const milestones = [7, 30, 100, 365];
  const nextMilestone = milestones.find(m => m > currentStreak) || milestones[milestones.length - 1];
  const progressToNext = (currentStreak / nextMilestone) * 100;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Flame className="w-8 h-8 text-orange-600" />
            </motion.div>
            <div>
              <div className="text-4xl font-black text-slate-900">{currentStreak}</div>
              <div className="text-sm text-slate-600">Day Streak</div>
            </div>
          </div>
          <div className="text-right">
            <Trophy className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <div className="text-2xl font-black text-slate-900">{longestStreak}</div>
            <div className="text-xs text-slate-600">Best</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-700">Next milestone</span>
            <span className="font-bold text-slate-900">{nextMilestone} days</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {milestones.map((milestone, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg text-center ${
                currentStreak >= milestone
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold">{milestone}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}