import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Download, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function WriteMode({ prompt, onSave }) {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.trim().split(/\s+/).filter(Boolean).length);
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-8 space-y-4">
        {prompt && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="font-bold text-blue-900 mb-2">Writing Prompt</div>
            <p className="text-slate-700">{prompt}</p>
          </div>
        )}

        <Textarea
          value={text}
          onChange={handleChange}
          placeholder="Begin writing your reflection..."
          className="min-h-[400px] rounded-xl font-serif text-lg"
        />

        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {wordCount} words
          </Badge>
          
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => onSave?.(text)}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}