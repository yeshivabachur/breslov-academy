import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Eye, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CourseAnalytics({ courseId }) {
  const enrollmentData = [
    { month: 'Jan', students: 12 },
    { month: 'Feb', students: 18 },
    { month: 'Mar', students: 25 },
    { month: 'Apr', students: 32 },
    { month: 'May', students: 45 },
    { month: 'Jun', students: 58 },
  ];

  const metrics = [
    { label: 'Total Views', value: '2,340', icon: Eye, color: 'from-blue-500 to-blue-600' },
    { label: 'Completion Rate', value: '78%', icon: Award, color: 'from-green-500 to-green-600' },
    { label: 'Avg Rating', value: '4.8', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Students', value: '45', icon: Users, color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass-effect border-0 premium-shadow rounded-2xl">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{metric.value}</div>
                  <div className="text-xs text-slate-600">{metric.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardHeader>
          <CardTitle>Enrollment Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}