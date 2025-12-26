import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GradeBook() {
  const [user, setUser] = useState(null);

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

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions', user?.email],
    queryFn: () => base44.entities.Submission.filter({ student_email: user.email, graded: true }),
    enabled: !!user?.email
  });

  const { data: quizAttempts = [] } = useQuery({
    queryKey: ['quiz-attempts', user?.email],
    queryFn: () => base44.entities.QuizAttempt.filter({ user_email: user.email }),
    enabled: !!user?.email
  });

  const averageGrade = submissions.length > 0
    ? submissions.reduce((sum, s) => sum + (s.grade_points / s.assignment_max_points) * 100, 0) / submissions.length
    : 0;

  const averageQuizScore = quizAttempts.length > 0
    ? quizAttempts.reduce((sum, q) => sum + q.score_percentage, 0) / quizAttempts.length
    : 0;

  const chartData = submissions.slice(0, 10).map((s, idx) => ({
    name: `Assignment ${idx + 1}`,
    score: (s.grade_points / s.assignment_max_points) * 100
  }));

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 mb-2">Grade Book</h1>
          <p className="text-slate-600 text-lg">Track your academic performance</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-effect border-0 premium-shadow rounded-[2rem]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-slate-600">Assignment Average</div>
              </div>
              <div className="text-4xl font-black text-slate-900">{averageGrade.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 premium-shadow rounded-[2rem]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-slate-600">Quiz Average</div>
              </div>
              <div className="text-4xl font-black text-slate-900">{averageQuizScore.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 premium-shadow rounded-[2rem]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-slate-600">Total Submissions</div>
              </div>
              <div className="text-4xl font-black text-slate-900">{submissions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Performance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="score" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Grades */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">Recent Grades</h2>
          {submissions.slice(0, 5).map((submission, idx) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{submission.assignment_title || 'Assignment'}</h4>
                      <p className="text-sm text-slate-600">Submitted {new Date(submission.created_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-slate-900">
                        {submission.grade_points}/{submission.assignment_max_points}
                      </div>
                      <div className="text-sm text-slate-600">
                        {((submission.grade_points / submission.assignment_max_points) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  {submission.feedback && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                      <p className="text-sm text-slate-700">{submission.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}