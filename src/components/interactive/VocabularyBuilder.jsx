import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Volume2, Star, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function VocabularyBuilder({ language = 'hebrew' }) {
  const [mastered, setMastered] = useState(156);
  const [learning, setLearning] = useState(24);

  const todayWords = [
    { word: 'שלום', transliteration: 'Shalom', meaning: 'Peace/Hello', mastered: true },
    { word: 'תורה', transliteration: 'Torah', meaning: 'Torah/Teaching', mastered: true },
    { word: 'חכמה', transliteration: 'Chochmah', meaning: 'Wisdom', mastered: false },
    { word: 'אמונה', transliteration: 'Emunah', meaning: 'Faith', mastered: false }
  ];

  const targetWords = 500;
  const progressPercent = (mastered / targetWords) * 100;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Star className="w-5 h-5 text-amber-600" />
            <div>
              <div>Vocabulary</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">אוצר מילים</div>
            </div>
          </div>
          <Badge className="bg-amber-100 text-amber-800">
            {mastered} words
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-3xl font-black text-slate-900">{mastered}</div>
            <div className="text-xs text-slate-600">Mastered</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl font-black text-slate-900">{learning}</div>
            <div className="text-xs text-slate-600">Learning</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-700">Progress to 500 words</span>
            <span className="font-bold text-slate-900">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold text-slate-700">Today's Words</div>
          {todayWords.map((word, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border-2 ${
                word.mastered 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-slate-900" dir="rtl">{word.word}</div>
                  <div className="text-sm text-slate-600">{word.transliteration}</div>
                  <div className="text-xs text-slate-500">{word.meaning}</div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}