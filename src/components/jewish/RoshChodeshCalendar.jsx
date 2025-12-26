import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Moon, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function RoshChodeshCalendar() {
  const [currentMonth, setCurrentMonth] = useState(null);
  const [nextRoshChodesh, setNextRoshChodesh] = useState(null);

  useEffect(() => {
    // In production, use Hebrew calendar library
    const hebrewMonths = [
      { name: 'Tishrei', hebrew: 'תשרי', significance: 'High Holidays' },
      { name: 'Cheshvan', hebrew: 'חשון', significance: '' },
      { name: 'Kislev', hebrew: 'כסלו', significance: 'Chanukah' },
      { name: 'Tevet', hebrew: 'טבת', significance: '' },
      { name: 'Shevat', hebrew: 'שבט', significance: 'Tu B\'Shevat' },
      { name: 'Adar', hebrew: 'אדר', significance: 'Purim' },
      { name: 'Nisan', hebrew: 'ניסן', significance: 'Pesach' },
      { name: 'Iyar', hebrew: 'אייר', significance: 'Lag B\'Omer' },
      { name: 'Sivan', hebrew: 'סיון', significance: 'Shavuot' },
      { name: 'Tammuz', hebrew: 'תמוז', significance: '' },
      { name: 'Av', hebrew: 'אב', significance: 'Tisha B\'Av' },
      { name: 'Elul', hebrew: 'אלול', significance: 'Preparation' }
    ];

    const monthIndex = new Date().getMonth();
    const currentHebMonth = hebrewMonths[monthIndex % 12];
    const nextMonth = hebrewMonths[(monthIndex + 1) % 12];
    
    setCurrentMonth(currentHebMonth);
    
    const next = new Date();
    next.setMonth(next.getMonth() + 1, 1);
    setNextRoshChodesh({ month: nextMonth, date: next });
  }, []);

  if (!currentMonth) return null;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Moon className="w-5 h-5 text-blue-600" />
          <div>
            <div>Hebrew Calendar</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">לוח עברי</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-2xl text-white text-center">
          <Star className="w-8 h-8 text-blue-300 mx-auto mb-3" />
          <div className="text-sm opacity-80 mb-2">Current Month</div>
          <div className="text-3xl font-black mb-1">{currentMonth.name}</div>
          <div className="text-2xl text-blue-300 font-serif" dir="rtl">{currentMonth.hebrew}</div>
          {currentMonth.significance && (
            <Badge className="bg-white/20 text-white border-white/30 mt-3">
              {currentMonth.significance}
            </Badge>
          )}
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <div className="text-sm font-bold text-purple-900">
              Upcoming Rosh Chodesh
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-900">{nextRoshChodesh?.month.name}</div>
            <div className="text-sm text-slate-600">
              {nextRoshChodesh?.date.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-600 text-center font-serif">
          Special prayers and customs apply on Rosh Chodesh - the beginning of each Hebrew month
        </div>
      </CardContent>
    </Card>
  );
}