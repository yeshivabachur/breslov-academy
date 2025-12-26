import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Moon, Clock, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function ShabbatTimer() {
  const [timeUntilShabbat, setTimeUntilShabbat] = useState(null);
  const [timeUntilHavdalah, setTimeUntilHavdalah] = useState(null);
  const [isShabbat, setIsShabbat] = useState(false);

  useEffect(() => {
    const calculateShabbatTimes = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      
      const fridayEvening = new Date(now);
      fridayEvening.setDate(now.getDate() + (5 - day + 7) % 7);
      fridayEvening.setHours(18, 15, 0);
      
      const saturdayNight = new Date(fridayEvening);
      saturdayNight.setDate(saturdayNight.getDate() + 1);
      saturdayNight.setHours(19, 30, 0);
      
      const isShabbatTime = (day === 5 && hour >= 18) || (day === 6 && hour < 20);
      setIsShabbat(isShabbatTime);
      
      if (!isShabbatTime) {
        const diff = fridayEvening - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilShabbat({ hours, minutes });
      } else {
        const diff = saturdayNight - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilHavdalah({ hours, minutes });
      }
    };

    calculateShabbatTimes();
    const interval = setInterval(calculateShabbatTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`border-0 premium-shadow-xl rounded-[2rem] ${
      isShabbat 
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900' 
        : 'glass-effect'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {isShabbat ? (
            <>
              <Moon className="w-8 h-8 text-purple-300 animate-pulse" />
              <div>
                <div className="text-2xl font-black text-white">Shabbat Shalom</div>
                <div className="text-purple-300 font-serif" dir="rtl">שבת שלום</div>
              </div>
            </>
          ) : (
            <>
              <Flame className="w-8 h-8 text-amber-600" />
              <div>
                <div className="text-2xl font-black text-slate-900">Shabbat Countdown</div>
                <div className="text-amber-700 font-serif" dir="rtl">ספירה לשבת</div>
              </div>
            </>
          )}
        </div>

        {isShabbat ? (
          <div className="space-y-3">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl text-white">
              <div className="text-sm opacity-80 mb-2">Time until Havdalah</div>
              <div className="text-4xl font-black">
                {timeUntilHavdalah?.hours}h {timeUntilHavdalah?.minutes}m
              </div>
            </div>
            <div className="text-sm text-white/80">
              Study mode optimized for Shabbat - No writing features active
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-sm text-amber-700 mb-2">Candle lighting in</div>
              <div className="text-4xl font-black text-slate-900">
                {timeUntilShabbat?.hours}h {timeUntilShabbat?.minutes}m
              </div>
            </div>
            <div className="text-sm text-slate-600">
              Friday, 6:15 PM • Jerusalem time
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}