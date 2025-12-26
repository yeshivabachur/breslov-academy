import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, RefreshCw, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ReviewCalendar({ reviews = [] }) {
  const [currentWeek, setCurrentWeek] = useState(0);

  const getWeekDays = (weekOffset = 0) => {
    const days = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const reviewsForDay = reviews.filter(r => {
        const reviewDate = new Date(r.scheduledDate);
        return reviewDate.toDateString() === date.toDateString();
      });
      
      days.push({
        date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        reviews: reviewsForDay,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const days = getWeekDays(currentWeek);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <div>
              <div>Review Schedule</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">לוח חזרות</div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(currentWeek - 1)}
              className="h-8 w-8 p-0 rounded-lg"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="h-8 w-8 p-0 rounded-lg"
            >
              →
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const hasReviews = day.reviews.length > 0;
            
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  day.isToday 
                    ? 'bg-blue-100 border-blue-400 shadow-md' 
                    : hasReviews
                    ? 'bg-purple-50 border-purple-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className={`text-xs mb-2 ${
                  day.isToday ? 'text-blue-800 font-bold' : 'text-slate-600'
                }`}>
                  {day.day}
                </div>
                <div className={`text-lg font-black ${
                  day.isToday ? 'text-blue-600' : 'text-slate-900'
                }`}>
                  {day.dayNum}
                </div>
                {hasReviews && (
                  <div className="mt-2">
                    <Badge className="bg-purple-600 text-white text-xs">
                      {day.reviews.length}
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold text-slate-700">
            Reviews Scheduled
          </div>
          {days.filter(d => d.reviews.length > 0).map((day, idx) => (
            <div
              key={idx}
              className="p-3 bg-purple-50 rounded-xl border border-purple-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-slate-900">
                  {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  {day.reviews.length} reviews
                </Badge>
              </div>
              <div className="space-y-1">
                {day.reviews.map((review, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <RefreshCw className="w-3 h-3 text-purple-600" />
                    <span>{review.topic || 'Lesson review'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-900 font-serif">
            📚 Consistent review is the key to long-term Torah retention
          </div>
        </div>
      </CardContent>
    </Card>
  );
}