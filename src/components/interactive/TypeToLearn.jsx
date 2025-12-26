import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Keyboard, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function TypeToLearn({ phrase }) {
  const [input, setInput] = useState('');
  const [completed, setCompleted] = useState(false);

  const targetPhrase = phrase || {
    hebrew: 'מצוה גדולה להיות בשמחה תמיד',
    transliteration: 'Mitzvah gedolah lihiyot besimcha tamid',
    translation: 'It is a great mitzvah to always be happy',
    source: 'Likutey Moharan II:24'
  };

  const checkAnswer = () => {
    const normalized = input.trim().replace(/\s+/g, ' ');
    return normalized === targetPhrase.hebrew;
  };

  const progress = (input.length / targetPhrase.hebrew.length) * 100;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-blue-600" />
          <Badge className="bg-blue-100 text-blue-800">Type to Learn</Badge>
        </div>

        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 text-center">
          <div className="text-sm text-blue-700 mb-2">{targetPhrase.transliteration}</div>
          <div className="text-2xl font-bold text-slate-900 mb-2">{targetPhrase.translation}</div>
          <div className="text-xs text-slate-600">— {targetPhrase.source}</div>
        </div>

        <div>
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (e.target.value === targetPhrase.hebrew) {
                setCompleted(true);
              }
            }}
            placeholder="Type in Hebrew..."
            className="text-2xl text-center rounded-xl font-serif h-16"
            dir="rtl"
          />
          <Progress value={progress} className="h-1 mt-2" />
        </div>

        {completed && (
          <div className="p-4 bg-green-50 rounded-xl border-2 border-green-300 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="font-bold text-green-900">Perfect! +25 XP</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}