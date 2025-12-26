import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Award, Crown, Gem } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export default function ProgressMilestones({ totalLessons = 0, totalXP = 0 }) {
  const milestones = [
    {
      id: 1,
      title: 'Scholar Initiate',
      requirement: '10 lessons',
      progress: totalLessons,
      target: 10,
      reward: '+50 XP, Bronze Badge',
      icon: Star,
      color: 'from-slate-400 to-slate-600',
      completed: totalLessons >= 10
    },
    {
      id: 2,
      title: 'Dedicated Student',
      requirement: '50 lessons',
      progress: totalLessons,
      target: 50,
      reward: '+200 XP, Silver Badge',
      icon: Award,
      color: 'from-blue-400 to-blue-600',
      completed: totalLessons >= 50
    },
    {
      id: 3,
      title: 'Torah Scholar',
      requirement: '100 lessons',
      progress: totalLessons,
      target: 100,
      reward: '+500 XP, Gold Badge',
      icon: Trophy,
      color: 'from-amber-400 to-yellow-600',
      completed: totalLessons >= 100
    },
    {
      id: 4,
      title: 'Master Teacher',
      requirement: '250 lessons',
      progress: totalLessons,
      target: 250,
      reward: '+1000 XP, Platinum Badge',
      icon: Crown,
      color: 'from-purple-400 to-pink-600',
      completed: totalLessons >= 250
    },
    {
      id: 5,
      title: 'Sage of Breslov',
      requirement: '500 lessons',
      progress: totalLessons,
      target: 500,
      reward: '+2500 XP, Diamond Badge',
      icon: Gem,
      color: 'from-cyan-400 to-blue-600',
      completed: totalLessons >= 500
    }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Trophy className="w-5 h-5 text-amber-600" />
          <div>
            <div>Learning Milestones</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">אבני דרך</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {milestones.map((milestone, idx) => {
          const Icon = milestone.icon;
          const progressPercent = Math.min((milestone.progress / milestone.target) * 100, 100);
          
          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                milestone.completed 
                  ? `bg-gradient-to-br ${milestone.color} text-white border-white/40` 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  milestone.completed 
                    ? 'bg-white/20' 
                    : `bg-gradient-to-br ${milestone.color}`
                }`}>
                  <Icon className={`w-6 h-6 ${milestone.completed ? 'text-white' : 'text-white'}`} />
                </div>
                
                <div className="flex-1">
                  <div className={`font-black text-lg mb-1 ${
                    milestone.completed ? 'text-white' : 'text-slate-900'
                  }`}>
                    {milestone.title}
                  </div>
                  <div className={`text-sm ${
                    milestone.completed ? 'text-white/80' : 'text-slate-600'
                  }`}>
                    {milestone.requirement}
                  </div>
                </div>

                {milestone.completed && (
                  <Badge className="bg-white/20 text-white border-white/30">
                    ✓ Earned
                  </Badge>
                )}
              </div>

              {!milestone.completed && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-bold text-slate-900">
                      {milestone.progress} / {milestone.target}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <div className="text-xs text-slate-600">
                    Reward: {milestone.reward}
                  </div>
                </div>
              )}

              {milestone.completed && (
                <div className="text-sm text-white/90">
                  🎉 {milestone.reward}
                </div>
              )}
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}