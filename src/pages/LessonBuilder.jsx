import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Save, ArrowLeft, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LessonBuilder() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState([]);
  const [lesson, setLesson] = useState({
    course_id: '',
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0,
    order_index: 0,
    content_text: '',
    is_free_preview: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        const myCourses = await base44.entities.Course.filter({ instructor_email: currentUser.email });
        setCourses(myCourses);
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Lesson.create(lesson);
      navigate(createPageUrl('InstructorDashboard'));
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={() => navigate(createPageUrl('InstructorDashboard'))}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl">
              <Video className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">Create New Lesson</h1>
              <p className="text-slate-600">Add content to your course</p>
            </div>
          </div>
        </motion.div>

        <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
          <CardContent className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Course</label>
              <Select value={lesson.course_id} onValueChange={(val) => setLesson({ ...lesson, course_id: val })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Lesson Title</label>
              <Input
                value={lesson.title}
                onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                placeholder="Introduction to the Concept"
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <Textarea
                value={lesson.description}
                onChange={(e) => setLesson({ ...lesson, description: e.target.value })}
                placeholder="What will students learn in this lesson?"
                className="min-h-[100px] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Video URL</label>
              <Input
                value={lesson.video_url}
                onChange={(e) => setLesson({ ...lesson, video_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
                <Input
                  type="number"
                  value={lesson.duration_minutes}
                  onChange={(e) => setLesson({ ...lesson, duration_minutes: parseInt(e.target.value) || 0 })}
                  placeholder="45"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
                <Input
                  type="number"
                  value={lesson.order_index}
                  onChange={(e) => setLesson({ ...lesson, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="1"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Lesson Content (Text)</label>
              <Textarea
                value={lesson.content_text}
                onChange={(e) => setLesson({ ...lesson, content_text: e.target.value })}
                placeholder="Additional reading material, notes, or transcripts..."
                className="min-h-[200px] rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div>
                <div className="font-bold text-slate-900">Free Preview</div>
                <div className="text-sm text-slate-600">Allow non-enrolled students to watch</div>
              </div>
              <Switch
                checked={lesson.is_free_preview}
                onCheckedChange={(val) => setLesson({ ...lesson, is_free_preview: val })}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || !lesson.course_id || !lesson.title}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl py-6"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Creating...' : 'Create Lesson'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}