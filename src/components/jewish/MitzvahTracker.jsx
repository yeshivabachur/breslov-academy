import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function MitzvahTracker({ userMitzvot = [] }) {
  const dailyMitzvot = [
    { id: 'shacharit', name: 'Shacharit', nameHebrew: 'שחרית', completed: false, time: 'Morning' },
    { id: 'tefillin', name: 'Tefillin', nameHebrew: 'תפילין', completed: false, time: 'Morning' },
    { id: 'torah_study', name: 'Torah Study', nameHebrew: 'לימוד תורה', completed: true, time: 'Daily' },
    { id: 'mincha', name: 'Mincha', nameHebrew: 'מנחה', completed: false, time: 'Afternoon' },
    { id: 'tzedakah', name: 'Tzedakah', nameHebrew: 'צדקה', completed: true, time: 'Daily' },
    { id: 'maariv', name: 'Maariv', nameHebrew: 'מעריב', completed: false, time: 'Evening' }
  ];

  const [mitzvot, setMitzvot] = useState(dailyMitzvot);
  
  const completedCount = mitzvot.filter(m => m.completed).length;
  const progressPercent = (completedCount / mitzvot.length) * 100;

  const toggleMitzvah = (id) => {
    setMitzvot(mitzvot.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Star className="w-5 h-5 text-amber-600" />
            <div>
              <div>Daily Mitzvot</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">מצוות יומיות</div>
            </div>
          </div>
          <Badge className="bg-amber-100 text-amber-800">
            {completedCount} / {mitzvot.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold text-slate-700">
            <span>Today's Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        <div className="space-y-2">
          {mitzvot.map((mitzvah, idx) => (
            <div
              key={mitzvah.id}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                mitzvah.completed
                  ? 'bg-green-50 border-green-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => toggleMitzvah(mitzvah.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      mitzvah.completed
                        ? 'bg-green-600 border-green-600'
                        : 'border-slate-300'
                    }`}
                  >
                    {mitzvah.completed && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{mitzvah.name}</div>
                    <div className="text-xs text-amber-700 font-serif" dir="rtl">{mitzvah.nameHebrew}</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {mitzvah.time}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {progressPercent === 100 && (
          <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-300 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <div className="font-black text-slate-900 mb-1">All Mitzvot Complete!</div>
            <div className="text-sm text-amber-800">
              "Great is the reward for one who performs many mitzvot"
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}