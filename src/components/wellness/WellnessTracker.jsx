import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Smile, Moon, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function WellnessTracker() {
  const [mood, setMood] = useState(null);

  const moods = [
    { emoji: '😊', label: 'Great', value: 5 },
    { emoji: '🙂', label: 'Good', value: 4 },
    { emoji: '😐', label: 'Okay', value: 3 },
    { emoji: '😕', label: 'Low', value: 2 },
    { emoji: '😢', label: 'Difficult', value: 1 }
  ];

  const wellnessStats = {
    avgMood: 4.2,
    sleepHours: 7.5,
    stressLevel: 'Low',
    mindfulness: 8
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Heart className="w-5 h-5 text-red-600" />
          <div>
            <div>Wellness Check</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">בדיקת רווחה</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="text-sm font-bold text-slate-700 mb-3">How are you feeling today?</div>
          <div className="flex gap-2">
            {moods.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setMood(m.value)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  mood === m.value 
                    ? 'bg-blue-100 border-blue-500 scale-110' 
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-1">{m.emoji}</div>
                <div className="text-xs text-slate-600">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <Smile className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-2xl font-black text-slate-900">{wellnessStats.avgMood}</div>
            <div className="text-xs text-slate-600">Avg Mood</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <Moon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-2xl font-black text-slate-900">{wellnessStats.sleepHours}</div>
            <div className="text-xs text-slate-600">Sleep (hrs)</div>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="text-sm text-green-900 font-serif">
            💚 Remember: "A healthy body houses a healthy soul" - Take care of yourself
          </div>
        </div>
      </CardContent>
    </Card>
  );
}