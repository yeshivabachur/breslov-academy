import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Award, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function AchievementTracker({ achievements = [] }) {
  const categories = [
    {
      name: 'Learning',
      icon: Star,
      color: 'from-blue-400 to-blue-600',
      achievements: [
        { id: 1, name: 'Complete 10 lessons', progress: 7, target: 10, earned: false },
        { id: 2, name: 'Watch 20 shiurim', progress: 15, target: 20, earned: false },
        { id: 3, name: 'Finish a course', progress: 1, target: 1, earned: true }
      ]
    },
    {
      name: 'Consistency',
      icon: Target,
      color: 'from-orange-400 to-red-600',
      achievements: [
        { id: 4, name: '7-day streak', progress: 7, target: 7, earned: true },
        { id: 5, name: '30-day streak', progress: 12, target: 30, earned: false },
        { id: 6, name: '100-day streak', progress: 12, target: 100, earned: false }
      ]
    },
    {
      name: 'Excellence',
      icon: Award,
      color: 'from-purple-400 to-pink-600',
      achievements: [
        { id: 7, name: 'Perfect quiz score', progress: 3, target: 5, earned: false },
        { id: 8, name: '90%+ average', progress: 1, target: 1, earned: true },
        { id: 9, name: 'Help 10 peers', progress: 4, target: 10, earned: false }
      ]
    }
  ];

  const totalEarned = categories.reduce((sum, cat) => 
    sum + cat.achievements.filter(a => a.earned).length, 0
  );
  const totalAchievements = categories.reduce((sum, cat) => 
    sum + cat.achievements.length, 0
  );

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Trophy className="w-5 h-5 text-amber-600" />
            <div>
              <div>Achievement Tracker</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">מעקב הישגים</div>
            </div>
          </div>
          <Badge className="bg-amber-100 text-amber-800">
            {totalEarned} / {totalAchievements}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-slate-900">Overall Progress</span>
            <span className="text-slate-600">{Math.round((totalEarned / totalAchievements) * 100)}%</span>
          </div>
          <Progress value={(totalEarned / totalAchievements) * 100} className="h-3" />
        </div>

        {categories.map((category, catIdx) => {
          const Icon = category.icon;
          const earned = category.achievements.filter(a => a.earned).length;
          
          return (
            <div key={catIdx} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-slate-900">{category.name}</div>
                  <div className="text-xs text-slate-600">
                    {earned} / {category.achievements.length} unlocked
                  </div>
                </div>
              </div>

              <div className="space-y-2 ml-12">
                {category.achievements.map((achievement, idx) => {
                  const progressPercent = (achievement.progress / achievement.target) * 100;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-3 rounded-xl border ${
                        achievement.earned 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-bold text-slate-900">
                          {achievement.name}
                        </div>
                        {achievement.earned && (
                          <Trophy className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      
                      {!achievement.earned && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Progress</span>
                            <span>{achievement.progress} / {achievement.target}</span>
                          </div>
                          <Progress value={progressPercent} className="h-1.5" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}