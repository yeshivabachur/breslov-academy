import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShabbatCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Mock Shabbat time - Friday 18:00
    const calculateTimeLeft = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const friday = new Date(now);
      
      // Set to next Friday 18:00
      const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
      friday.setDate(now.getDate() + daysUntilFriday);
      friday.setHours(18, 0, 0, 0);

      const difference = friday - now;
      
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] overflow-hidden">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center"
          >
            <Flame className="w-16 h-16 text-amber-300" />
          </motion.div>

          <h3 className="text-2xl font-black text-white">Time Until Shabbat</h3>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
              >
                <div className="text-5xl font-black text-white font-mono">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-sm text-white/80 font-semibold mt-1">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
            <Moon className="w-4 h-4" />
            <span>Candle lighting at 4:32 PM</span>
          </div>
        </div>
      </div>
    </Card>
  );
}