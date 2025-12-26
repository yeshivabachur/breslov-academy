import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus, Video, FileText, Trophy, Settings, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdvancedCourseBuilder({ course, onSave }) {
  const [curriculum, setCurriculum] = useState({
    sections: [
      {
        id: '1',
        title: 'Introduction',
        lessons: [
          { id: 'l1', title: 'Welcome to the Course', type: 'video', duration: 5 },
          { id: 'l2', title: 'Course Overview', type: 'text', duration: 3 }
        ]
      }
    ]
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const sections = Array.from(curriculum.sections);
    const [reordered] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reordered);
    
    setCurriculum({ ...curriculum, sections });
  };

  const addSection = () => {
    setCurriculum({
      sections: [...curriculum.sections, {
        id: Date.now().toString(),
        title: 'New Section',
        lessons: []
      }]
    });
  };

  const addLesson = (sectionId) => {
    const sections = curriculum.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: [...section.lessons, {
            id: Date.now().toString(),
            title: 'New Lesson',
            type: 'video',
            duration: 0
          }]
        };
      }
      return section;
    });
    setCurriculum({ sections });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-2xl">Curriculum Builder</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl font-serif">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={() => onSave?.(curriculum)}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-serif"
              >
                Save Curriculum
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {curriculum.sections.map((section, sectionIdx) => (
                    <Draggable key={section.id} draggableId={section.id} index={sectionIdx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Card className="bg-white border-2 border-slate-200 rounded-2xl">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="w-5 h-5 text-slate-400 cursor-grab" />
                                </div>
                                <Input
                                  value={section.title}
                                  onChange={(e) => {
                                    const sections = [...curriculum.sections];
                                    sections[sectionIdx].title = e.target.value;
                                    setCurriculum({ sections });
                                  }}
                                  className="text-lg font-bold font-serif rounded-xl"
                                />
                                <Badge variant="outline">{section.lessons.length} lessons</Badge>
                              </div>

                              {/* Lessons */}
                              <div className="space-y-2 ml-8">
                                {section.lessons.map((lesson, lessonIdx) => {
                                  const Icon = lesson.type === 'video' ? Video : 
                                             lesson.type === 'quiz' ? Trophy : FileText;
                                  return (
                                    <div key={lesson.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                      <Icon className="w-4 h-4 text-slate-600" />
                                      <Input
                                        value={lesson.title}
                                        className="flex-1 text-sm font-serif"
                                        placeholder="Lesson title..."
                                      />
                                      <Input
                                        type="number"
                                        value={lesson.duration}
                                        className="w-20 text-sm"
                                        placeholder="min"
                                      />
                                      <Button variant="ghost" size="sm">
                                        <Settings className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  );
                                })}
                                
                                <Button
                                  onClick={() => addLesson(section.id)}
                                  variant="outline"
                                  size="sm"
                                  className="w-full rounded-xl font-serif"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Lesson
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            onClick={addSection}
            variant="outline"
            className="w-full rounded-2xl py-6 font-serif text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Section
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}