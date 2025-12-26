import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Calendar, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AssignmentBuilder({ courseId, onSave }) {
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    type: 'essay',
    points: 100,
    dueDate: '',
    rubric: []
  });

  const assignmentTypes = [
    { value: 'essay', label: 'Written Essay', icon: '📝' },
    { value: 'video', label: 'Video Presentation', icon: '🎥' },
    { value: 'discussion', label: 'Discussion Post', icon: '💬' },
    { value: 'quiz', label: 'Comprehension Quiz', icon: '✅' },
    { value: 'project', label: 'Creative Project', icon: '🎨' }
  ];

  const rubricCriteria = [
    { name: 'Understanding of Concepts', points: 40 },
    { name: 'Depth of Analysis', points: 30 },
    { name: 'Hebrew/Aramaic Usage', points: 15 },
    { name: 'Personal Application', points: 15 }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <FileText className="w-5 h-5 text-blue-600" />
          <div>
            <div>Create Assignment</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">יצירת מטלה</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Assignment Title
          </label>
          <Input
            value={assignment.title}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
            placeholder="e.g., Reflection on Azamra"
            className="rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Type
          </label>
          <Select 
            value={assignment.type}
            onValueChange={(v) => setAssignment({ ...assignment, type: v })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assignmentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Instructions
          </label>
          <Textarea
            value={assignment.description}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
            placeholder="Detailed instructions for students..."
            className="min-h-[120px] rounded-xl font-serif"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Points
            </label>
            <Input
              type="number"
              value={assignment.points}
              onChange={(e) => setAssignment({ ...assignment, points: e.target.value })}
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Due Date
            </label>
            <Input
              type="date"
              value={assignment.dueDate}
              onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="text-sm font-bold text-purple-900 mb-3">Grading Rubric</div>
          <div className="space-y-2">
            {rubricCriteria.map((criterion, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-purple-800">{criterion.name}</span>
                <Badge variant="outline" className="text-purple-800">
                  {criterion.points} pts
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onSave?.(assignment)}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Assignment
        </Button>
      </CardContent>
    </Card>
  );
}