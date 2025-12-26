import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Search, Download, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function CourseNotes({ courseId, userEmail }) {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Key Insights - Azamra',
      content: 'The teaching to find the good point in everyone, even in oneself...',
      lessonTitle: 'Likutey Moharan Torah 1',
      tags: ['Azamra', 'Self-improvement'],
      created: new Date(Date.now() - 86400000)
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewNote, setShowNewNote] = useState(false);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <div>Course Notes</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">רשימות הקורס</div>
            </div>
          </div>
          <Button
            onClick={() => setShowNewNote(!showNewNote)}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="pl-10 rounded-xl"
          />
        </div>

        {showNewNote && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3">
            <Input placeholder="Note title..." className="rounded-lg" />
            <Textarea placeholder="Your insights..." className="min-h-[100px] rounded-lg" />
            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl">
              Save Note
            </Button>
          </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notes.map((note, idx) => (
            <div
              key={note.id}
              className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all"
            >
              <div className="font-bold text-slate-900 mb-1">{note.title}</div>
              <div className="text-sm text-slate-600 mb-2 line-clamp-2">{note.content}</div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}