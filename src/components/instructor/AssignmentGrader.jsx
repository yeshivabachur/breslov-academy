import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function AssignmentGrader({ submissions, onGraded }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [grading, setGrading] = useState(false);

  const handleGrade = async () => {
    if (!selectedSubmission || !grade) return;
    
    setGrading(true);
    try {
      await base44.entities.Submission.update(selectedSubmission.id, {
        grade_points: parseFloat(grade),
        feedback: feedback,
        graded: true
      });
      onGraded?.();
      setSelectedSubmission(null);
      setGrade('');
      setFeedback('');
    } catch (error) {
      console.error('Error grading:', error);
    }
    setGrading(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Submissions List */}
      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Pending Submissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
          {submissions?.filter(s => !s.graded).map((submission, idx) => (
            <motion.button
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedSubmission(submission)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                selectedSubmission?.id === submission.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-slate-900">{submission.student_name}</div>
                  <div className="text-xs text-slate-600">{submission.student_email}</div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>
              <div className="text-sm text-slate-700">{submission.assignment_title}</div>
            </motion.button>
          ))}
          
          {submissions?.filter(s => !s.graded).length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              All caught up!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grading Panel */}
      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardHeader>
          <CardTitle>Grade Submission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedSubmission ? (
            <>
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="font-bold text-slate-900 mb-1">{selectedSubmission.student_name}</div>
                <div className="text-sm text-slate-600">{selectedSubmission.assignment_title}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Grade (out of {selectedSubmission.assignment_max_points})
                </label>
                <Input
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="0"
                  max={selectedSubmission.assignment_max_points}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Feedback</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback..."
                  className="min-h-[150px] rounded-xl"
                />
              </div>

              <Button
                onClick={handleGrade}
                disabled={grading || !grade}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl"
              >
                <Send className="w-4 h-4 mr-2" />
                {grading ? 'Submitting...' : 'Submit Grade'}
              </Button>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Select a submission to grade
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}