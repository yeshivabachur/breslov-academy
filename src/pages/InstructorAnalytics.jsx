import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstructorAnalytics() {
  const [user, setUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: myCourses = [] } = useQuery({
    queryKey: ['instructor-courses', user?.email],
    queryFn: () => base44.entities.Course.filter({ instructor_email: user.email }),
    enabled: !!user?.email
  });

  const enrollmentTrend = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 18 },
    { month: 'Mar', count: 25 },
    { month: 'Apr', count: 35 },
    { month: 'May', count: 48 },
    { month: 'Jun', count: 62 },
  ];

  const coursePerformance = myCourses.slice(0, 5).map(c => ({
    name: c.title.substring(0, 20),
    students: Math.floor(Math.random() * 100),
    rating: (Math.random() * 2 + 3).toFixed(1)
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Analytics Dashboard</h1>
            <p className="text-slate-600 text-lg">Track your teaching performance</p>
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-64 rounded-xl">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {myCourses.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'from-green-500 to-green-600' },
            { label: 'Active Students', value: '248', icon: Users, color: 'from-blue-500 to-blue-600' },
            { label: 'Avg Rating', value: '4.8', icon: Award, color: 'from-purple-500 to-purple-600' },
            { label: 'Growth', value: '+23%', icon: TrendingUp, color: 'from-amber-500 to-amber-600' },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-effect border-0 premium-shadow rounded-2xl">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-black text-slate-900">{metric.value}</div>
                    <div className="text-sm text-slate-600">{metric.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Enrollment Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Course Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={coursePerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}