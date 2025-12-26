import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Assignments() {
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

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments', user?.email],
    queryFn: async () => {
      const enrollments = await base44.entities.CourseRegistration.filter({ user_email: user.email });
      const courseIds = enrollments.map(e => e.course_id);
      const allAssignments = await base44.entities.Assignment.list();
      return allAssignments.filter(a => courseIds.includes(a.course_id));
    },
    enabled: !!user?.email
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions', user?.email],
    queryFn: () => base44.entities.Submission.filter({ student_email: user.email }),
    enabled: !!user?.email
  });

  const getStatus = (assignment) => {
    const submission = submissions.find(s => s.assignment_id === assignment.id);
    if (submission?.graded) return 'graded';
    if (submission) return 'submitted';
    const dueDate = new Date(assignment.due_date);
    if (dueDate < new Date()) return 'overdue';
    return 'pending';
  };

  const statusConfig = {
    graded: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    submitted: { color: 'bg-blue-100 text-blue-800', icon: Clock },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    overdue: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
  };

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 mb-2">Assignments</h1>
          <p className="text-slate-600 text-lg">Complete your coursework and submit assignments</p>
        </motion.div>

        <div className="space-y-4">
          {assignments.map((assignment, idx) => {
            const status = getStatus(assignment);
            const config = statusConfig[status];
            const Icon = config.icon;
            const submission = submissions.find(s => s.assignment_id === assignment.id);

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all rounded-[2rem]">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h3 className="text-xl font-black text-slate-900">{assignment.title}</h3>
                        </div>
                        <p className="text-slate-600 mb-3">{assignment.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={config.color}>
                            <Icon className="w-3 h-3 mr-1" />
                            {status}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                          </Badge>
                          {submission?.graded && (
                            <Badge className="bg-purple-100 text-purple-800">
                              Score: {submission.grade_points}/{assignment.max_points}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {status === 'pending' || status === 'overdue' ? (
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl">
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Assignment
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full rounded-2xl">
                        View Submission
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {assignments.length === 0 && (
            <Card className="glass-effect border-2 border-dashed border-slate-300 rounded-[2rem]">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No assignments yet</h3>
                <p className="text-slate-600">Assignments will appear here when instructors create them</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}