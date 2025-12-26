import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Volume2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HalachaDaily() {
  const [dailyHalacha, setDailyHalacha] = useState(null);

  useEffect(() => {
    const halachot = [
      {
        title: 'Washing Hands',
        titleHebrew: 'נטילת ידיים',
        text: 'Upon waking, wash hands three times alternating right and left. This removes spiritual impurity that rests on hands during sleep.',
        source: 'Shulchan Aruch, Orach Chaim 4:2',
        category: 'Morning Rituals'
      },
      {
        title: 'Blessings on Food',
        titleHebrew: 'ברכות המזון',
        text: 'Different foods require different blessings. Bread requires HaMotzi, wine requires Borei Pri HaGafen, and fruits require Borei Pri HaEtz.',
        source: 'Shulchan Aruch, Orach Chaim 202',
        category: 'Blessings'
      }
    ];

    const dayIndex = new Date().getDay();
    setDailyHalacha(halachot[dayIndex % halachot.length]);
  }, []);

  if (!dailyHalacha) return null;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <BookOpen className="w-5 h-5 text-green-600" />
          <div>
            <div>Halacha of the Day</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">הלכה יומית</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
          <Badge className="bg-green-100 text-green-800 mb-3">
            {dailyHalacha.category}
          </Badge>
          <h3 className="text-2xl font-black text-slate-900 mb-2">{dailyHalacha.title}</h3>
          <div className="text-lg text-green-700 font-serif mb-4" dir="rtl">
            {dailyHalacha.titleHebrew}
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            {dailyHalacha.text}
          </p>
          <div className="text-sm text-green-800 font-semibold">
            📖 Source: {dailyHalacha.source}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
            <Volume2 className="w-4 h-4 mr-2" />
            Listen
          </Button>
          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}