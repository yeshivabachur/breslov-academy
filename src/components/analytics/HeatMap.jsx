import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

export default function HeatMap({ data }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getActivityLevel = (day, hour) => {
    return Math.floor(Math.random() * 5);
  };

  const getColor = (level) => {
    if (level === 0) return 'bg-slate-100';
    if (level === 1) return 'bg-blue-200';
    if (level === 2) return 'bg-blue-400';
    if (level === 3) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Flame className="w-5 h-5 text-blue-600" />
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block">
            <div className="grid grid-cols-25 gap-1">
              <div className="w-12" />
              {hours.map(hour => (
                <div key={hour} className="w-3 text-xs text-slate-600 text-center">
                  {hour % 6 === 0 ? hour : ''}
                </div>
              ))}
            </div>
            
            {days.map((day, dayIdx) => (
              <div key={day} className="grid grid-cols-25 gap-1 mt-1">
                <div className="w-12 text-xs text-slate-600 flex items-center">{day}</div>
                {hours.map((hour, hourIdx) => {
                  const level = getActivityLevel(dayIdx, hourIdx);
                  return (
                    <div
                      key={hour}
                      className={`w-3 h-3 rounded ${getColor(level)}`}
                      title={`${day} ${hour}:00 - Activity: ${level}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-slate-600">
          <span>Less active</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div key={level} className={`w-3 h-3 rounded ${getColor(level)}`} />
            ))}
          </div>
          <span>More active</span>
        </div>
      </CardContent>
    </Card>
  );
}