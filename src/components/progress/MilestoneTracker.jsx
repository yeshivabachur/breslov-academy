import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MilestoneTracker() {
  const milestones = [
    { title: 'Complete First Course', achieved: true, xp: 100 },
    { title: 'Study for 7 Days Straight', achieved: true, xp: 200 },
    { title: '10 Hours of Learning', achieved: true, xp: 150 },
    { title: 'Join a Study Group', achieved: false, xp: 100 },
    { title: 'Complete 5 Courses', achieved: false, xp: 500 },
    { title: 'Master Hebrew Vocabulary', achieved: false, xp: 300 },
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-600" />
          Learning Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                milestone.achieved
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                  : 'bg-slate-50'
              }`}
            >
              {milestone.achieved ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-slate-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className={`font-bold ${milestone.achieved ? 'text-slate-900' : 'text-slate-600'}`}>
                  {milestone.title}
                </div>
                <div className="text-sm text-slate-500">+{milestone.xp} XP</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <div className="text-2xl font-black text-slate-900 mb-1">
            {milestones.filter(m => m.achieved).length} / {milestones.length}
          </div>
          <div className="text-sm text-slate-600">Milestones Completed</div>
        </div>
      </CardContent>
    </Card>
  );
}