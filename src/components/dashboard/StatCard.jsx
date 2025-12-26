import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, change, color = 'blue' }) {
  const isPositive = change > 0;
  
  const colors = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    amber: 'from-amber-400 to-amber-600',
    red: 'from-red-400 to-red-600'
  };

  return (
    <motion.div whileHover={{ scale: 1.05, y: -4 }}>
      <Card className="glass-effect border-0 premium-shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-xs font-bold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(change)}%
              </div>
            )}
          </div>
          
          <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
          <div className="text-sm text-slate-600">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}