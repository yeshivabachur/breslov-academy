import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Bold, Italic, List, Link } from 'lucide-react';
import ReactQuill from 'react-quill';

export default function NoteEditor({ initialContent, onSave }) {
  const [content, setContent] = useState(initialContent || '');

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Take notes during your study..."
          className="bg-white rounded-xl"
          style={{ minHeight: '300px' }}
        />

        <Button
          onClick={() => onSave?.(content)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Notes
        </Button>
      </CardContent>
    </Card>
  );
}