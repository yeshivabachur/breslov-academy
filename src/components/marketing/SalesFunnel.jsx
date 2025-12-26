import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Users, DollarSign, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, FunnelChart, Funnel, Cell } from 'recharts';

export default function SalesFunnel({ funnelData }) {
  const stages = [
    { name: 'Landing Page Views', value: 10000, fill: '#3b82f6' },
    { name: 'Free Preview Started', value: 4200, fill: '#8b5cf6' },
    { name: 'Email Captured', value: 2100, fill: '#ec4899' },
    { name: 'Trial Started', value: 840, fill: '#f59e0b' },
    { name: 'Purchased', value: 420, fill: '#10b981' }
  ];

  const conversionRate = ((420 / 10000) * 100).toFixed(2);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="font-serif flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-blue-600" />
          Enrollment Funnel Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Visitors', value: '10,000', icon: Users, color: 'from-blue-500 to-blue-600' },
            { label: 'Leads', value: '2,100', icon: Target, color: 'from-purple-500 to-purple-600' },
            { label: 'Students', value: '420', icon: Users, color: 'from-green-500 to-green-600' },
            { label: 'Conversion', value: `${conversionRate}%`, icon: DollarSign, color: 'from-amber-500 to-amber-600' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="p-4 bg-white rounded-xl text-center">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-600">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-4 font-serif">Conversion Funnel</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stages} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {stages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {stages.map((stage, idx) => {
            const dropoff = idx > 0 
              ? ((stages[idx-1].value - stage.value) / stages[idx-1].value * 100).toFixed(1)
              : 0;
            
            return (
              <div key={idx} className="text-center">
                <div className="h-2 bg-slate-200 rounded-full mb-2">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${(stage.value / stages[0].value) * 100}%`,
                      background: stage.fill
                    }}
                  />
                </div>
                <div className="text-xs text-slate-600">{stage.name}</div>
                {idx > 0 && (
                  <div className="text-xs text-red-600 font-bold">-{dropoff}%</div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}