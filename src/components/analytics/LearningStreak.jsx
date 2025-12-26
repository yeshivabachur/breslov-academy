import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Calendar, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LearningStreak({ streakData }) {
  const currentStreak = streakData?.current_streak || 0;
  const longestStreak = streakData?.longest_streak || 0;
  
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const hasActivity = i < currentStreak;
      
      days.push({
        date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hasActivity
      });
    }
    
    return days;
  };

  const days = getLast7Days();

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <div className="font-serif">
              <div>Learning Streak</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">רצף לימוד</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-orange-600">{currentStreak}</div>
            <div className="text-xs text-slate-600">days</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-2">
          {days.map((day, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center"
            >
              <div className="text-xs text-slate-600 mb-2">{day.day}</div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                  day.hasActivity
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg scale-110'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {day.hasActivity ? (
                  <Flame className="w-6 h-6" />
                ) : (
                  <Calendar className="w-5 h-5" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{longestStreak}</div>
            <div className="text-xs text-slate-600">Best Streak</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-black text-slate-900">{Math.floor(currentStreak / 7)}</div>
            <div className="text-xs text-slate-600">Weeks</div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
          <div className="text-sm text-orange-900 font-bold mb-2">
            🔥 Keep the fire burning!
          </div>
          <div className="text-xs text-orange-800">
            {currentStreak === 0 
              ? 'Start your learning journey today!'
              : currentStreak < 7
              ? `${7 - currentStreak} more days to complete your first week!`
              : currentStreak < 30
              ? `Amazing! ${30 - currentStreak} days until 1 month milestone!`
              : 'Incredible dedication! You\'re a true Torah scholar!'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}