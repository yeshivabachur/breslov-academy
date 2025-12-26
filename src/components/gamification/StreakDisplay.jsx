import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StreakDisplay({ currentStreak = 7, longestStreak = 30, goal = 100 }) {
  const progress = (currentStreak / goal) * 100;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] overflow-hidden">
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-8">
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex justify-center mb-4"
            >
              <Flame className="w-20 h-20 text-amber-300 drop-shadow-2xl" />
            </motion.div>
            <h3 className="text-6xl font-black text-white mb-2">
              {currentStreak}
            </h3>
            <p className="text-xl text-white/90 font-bold">Day Streak</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <Trophy className="w-8 h-8 text-amber-300 mx-auto mb-2" />
              <div className="text-3xl font-black text-white">{longestStreak}</div>
              <div className="text-sm text-white/80 font-medium">Longest</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <Target className="w-8 h-8 text-green-300 mx-auto mb-2" />
              <div className="text-3xl font-black text-white">{goal}</div>
              <div className="text-sm text-white/80 font-medium">Goal</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/90 font-medium">
              <span>Progress to goal</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}