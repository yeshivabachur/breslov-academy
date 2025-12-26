import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Bold, Italic, List, Link2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NoteEditor({ lessonId, onSave }) {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave?.(content);
    setIsSaving(false);
  };

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('note-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const newText = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end);
    setContent(newText);
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Study Notes
          </CardTitle>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 p-2 bg-slate-100 rounded-xl">
          <Button
            onClick={() => insertFormatting('**', '**')}
            variant="ghost"
            size="sm"
            className="rounded-lg"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => insertFormatting('*', '*')}
            variant="ghost"
            size="sm"
            className="rounded-lg"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => insertFormatting('- ')}
            variant="ghost"
            size="sm"
            className="rounded-lg"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => insertFormatting('[', '](url)')}
            variant="ghost"
            size="sm"
            className="rounded-lg"
          >
            <Link2 className="w-4 h-4" />
          </Button>
        </div>

        <textarea
          id="note-editor"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Take notes on your learning..."
          className="w-full h-64 p-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 resize-none font-mono text-sm"
        />

        <div className="text-xs text-slate-500">
          {content.length} characters • Supports Markdown formatting
        </div>
      </CardContent>
    </Card>
  );
}