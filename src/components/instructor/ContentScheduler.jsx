import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Send, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContentScheduler({ lessons = [] }) {
  const [schedule, setSchedule] = useState([
    { lessonId: 1, releaseDate: '2025-01-01', status: 'scheduled' },
    { lessonId: 2, releaseDate: '2025-01-08', status: 'scheduled' },
    { lessonId: 3, releaseDate: '2025-01-15', status: 'draft' }
  ]);

  const sampleLessons = [
    { id: 1, title: 'Introduction to Likutey Moharan', order: 1 },
    { id: 2, title: 'The Concept of Azamra', order: 2 },
    { id: 3, title: 'Finding the Good Point', order: 3 },
    { id: 4, title: 'Practical Applications', order: 4 }
  ];

  const activeLessons = lessons.length > 0 ? lessons : sampleLessons;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <div>Content Drip Schedule</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">לוח פרסום תוכן</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-900 font-serif">
            📅 <strong>Drip Learning:</strong> Release lessons gradually to prevent overwhelm and ensure proper absorption
          </div>
        </div>

        <div className="space-y-3">
          {activeLessons.map((lesson, idx) => {
            const scheduleItem = schedule.find(s => s.lessonId === lesson.id);
            
            return (
              <div
                key={lesson.id}
                className="p-4 bg-white rounded-xl border-2 border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-slate-900">{lesson.title}</div>
                    <div className="text-xs text-slate-600">Lesson {lesson.order}</div>
                  </div>
                  <Badge className={
                    scheduleItem?.status === 'published' ? 'bg-green-100 text-green-800' :
                    scheduleItem?.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-600'
                  }>
                    {scheduleItem?.status || 'draft'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Release Date</label>
                    <input
                      type="date"
                      value={scheduleItem?.releaseDate || ''}
                      className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Status</label>
                    <Select defaultValue={scheduleItem?.status || 'draft'}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl"
        >
          <Send className="w-5 h-5 mr-2" />
          Save Schedule
        </Button>
      </CardContent>
    </Card>
  );
}