import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FastDayCalendar() {
  const [upcomingFasts, setUpcomingFasts] = useState([]);

  useEffect(() => {
    // In production, calculate from Hebrew calendar
    const fasts = [
      {
        name: '17th of Tammuz',
        nameHebrew: 'י״ז בתמוז',
        date: new Date('2025-07-13'),
        type: 'minor',
        significance: 'Breach of Jerusalem walls'
      },
      {
        name: 'Tisha B\'Av',
        nameHebrew: 'תשעה באב',
        date: new Date('2025-08-03'),
        type: 'major',
        significance: 'Destruction of both Temples'
      },
      {
        name: 'Fast of Gedaliah',
        nameHebrew: 'צום גדליה',
        date: new Date('2025-09-23'),
        type: 'minor',
        significance: 'Assassination of Gedaliah'
      }
    ];

    setUpcomingFasts(fasts);
  }, []);

  const getNextFast = () => {
    const now = new Date();
    return upcomingFasts.find(f => f.date > now);
  };

  const nextFast = getNextFast();

  if (!nextFast) return null;

  const daysUntil = Math.floor((nextFast.date - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Moon className="w-5 h-5 text-indigo-600" />
          <div>
            <div>Fast Days</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">ימי צום</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-2xl text-white text-center">
          <Calendar className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
          <div className="text-sm opacity-80 mb-2">Next Fast Day</div>
          <div className="text-2xl font-black mb-1">{nextFast.name}</div>
          <div className="text-xl text-indigo-300 font-serif mb-3" dir="rtl">
            {nextFast.nameHebrew}
          </div>
          <Badge className={`${
            nextFast.type === 'major' 
              ? 'bg-red-600 text-white' 
              : 'bg-blue-600 text-white'
          }`}>
            {daysUntil} days
          </Badge>
        </div>

        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
          <div className="text-sm font-bold text-indigo-900 mb-2">
            Significance
          </div>
          <div className="text-sm text-indigo-800">
            {nextFast.significance}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold text-slate-700">Upcoming Fasts</div>
          {upcomingFasts.slice(1, 3).map((fast, idx) => (
            <div
              key={idx}
              className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center"
            >
              <div>
                <div className="font-bold text-slate-900 text-sm">{fast.name}</div>
                <div className="text-xs text-indigo-700 font-serif" dir="rtl">{fast.nameHebrew}</div>
              </div>
              <div className="text-xs text-slate-600">
                {fast.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}