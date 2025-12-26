import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgressDashboard({ stats }) {
  const mockStats = stats || {
    totalHours: 127,
    coursesCompleted: 8,
    currentStreak: 15,
    averageScore: 92,
  };

  const statCards = [
    { 
      label: 'Total Study Time',
      value: `${mockStats.totalHours}h`,
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      label: 'Courses Completed',
      value: mockStats.coursesCompleted,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      change: '+3'
    },
    {
      label: 'Current Streak',
      value: `${mockStats.currentStreak} days`,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-600',
      change: 'Record!'
    },
    {
      label: 'Average Score',
      value: `${mockStats.averageScore}%`,
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      change: '+5%'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all rounded-[2rem] overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}