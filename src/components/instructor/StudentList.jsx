import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentList({ courseId, students }) {
  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Enrolled Students
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {students?.map((student, idx) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {student.name?.[0] || 'S'}
              </div>
              <div>
                <div className="font-bold text-slate-900">{student.name || 'Student'}</div>
                <div className="text-xs text-slate-600">{student.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                {student.progress || 0}% complete
              </Badge>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <BarChart className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}

        {(!students || students.length === 0) && (
          <div className="text-center py-8 text-slate-500">
            No students enrolled yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}