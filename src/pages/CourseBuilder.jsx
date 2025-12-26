import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Plus, Save, Upload, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CourseBuilder() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState({
    title: '',
    title_hebrew: '',
    description: '',
    instructor: '',
    instructor_email: '',
    category: '',
    level: 'beginner',
    duration_hours: 0,
    access_tier: 'free',
    price: 0,
    is_published: false,
    thumbnail_url: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setCourse(prev => ({
          ...prev,
          instructor: currentUser.full_name,
          instructor_email: currentUser.email
        }));
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const newCourse = await base44.entities.Course.create(course);
      navigate(createPageUrl('InstructorDashboard'));
    } catch (error) {
      console.error('Error creating course:', error);
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
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">Create New Course</h1>
              <p className="text-slate-600">Share your knowledge with students worldwide</p>
            </div>
          </div>
        </motion.div>

        <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
          <CardContent className="p-8 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Course Title</label>
                <Input
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  placeholder="Introduction to Breslov Philosophy"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hebrew Title (Optional)</label>
                <Input
                  value={course.title_hebrew}
                  onChange={(e) => setCourse({ ...course, title_hebrew: e.target.value })}
                  placeholder="מבוא לפילוסופיה ברסלב"
                  className="rounded-xl"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <Textarea
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  placeholder="Describe what students will learn..."
                  className="min-h-[120px] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <Select value={course.category} onValueChange={(val) => setCourse({ ...course, category: val })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Torah">Torah</SelectItem>
                      <SelectItem value="Talmud">Talmud</SelectItem>
                      <SelectItem value="Kabbalah">Kabbalah</SelectItem>
                      <SelectItem value="Halacha">Halacha</SelectItem>
                      <SelectItem value="Chassidus">Chassidus</SelectItem>
                      <SelectItem value="Hebrew">Hebrew Language</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Level</label>
                  <Select value={course.level} onValueChange={(val) => setCourse({ ...course, level: val })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (hours)</label>
                <Input
                  type="number"
                  value={course.duration_hours}
                  onChange={(e) => setCourse({ ...course, duration_hours: parseInt(e.target.value) || 0 })}
                  placeholder="10"
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">Pricing & Access</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Access Tier</label>
                  <Select value={course.access_tier} onValueChange={(val) => setCourse({ ...course, access_tier: val })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price ($)</label>
                  <Input
                    type="number"
                    value={course.price}
                    onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">Course Thumbnail</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Thumbnail URL</label>
                <Input
                  value={course.thumbnail_url}
                  onChange={(e) => setCourse({ ...course, thumbnail_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Publish */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <div className="font-bold text-slate-900">Publish Course</div>
                <div className="text-sm text-slate-600">Make this course visible to students</div>
              </div>
              <Switch
                checked={course.is_published}
                onCheckedChange={(val) => setCourse({ ...course, is_published: val })}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <Button
                onClick={handleSave}
                disabled={saving || !course.title || !course.category}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl py-6"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}