import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShabbatMode() {
  const [isShabbat, setIsShabbat] = useState(false);
  const [candleLighting, setCandleLighting] = useState(null);
  const [havdalah, setHavdalah] = useState(null);

  useEffect(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    // Friday evening to Saturday night
    const isShabbatTime = (day === 5 && hour >= 18) || (day === 6 && hour < 20);
    setIsShabbat(isShabbatTime);
    
    // Calculate times (simplified)
    const friday = new Date(now);
    friday.setDate(now.getDate() + (5 - day));
    friday.setHours(18, 15, 0);
    setCandleLighting(friday);
    
    const saturday = new Date(friday);
    saturday.setDate(saturday.getDate() + 1);
    saturday.setHours(19, 30, 0);
    setHavdalah(saturday);
  }, []);

  if (!isShabbat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-50"
    >
      <Card className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 border-2 border-amber-300 shadow-2xl">
        <CardContent className="p-6 text-center">
          <Moon className="w-12 h-12 text-amber-300 mx-auto mb-3" />
          <div className="text-2xl font-black text-white mb-2" dir="rtl">שבת שלום</div>
          <div className="text-amber-300 font-serif mb-4">Shabbat Shalom</div>
          <div className="text-white/80 text-sm">
            Learning mode optimized for Shabbat
          </div>
          <div className="mt-4 text-xs text-white/60">
            Havdalah: {havdalah?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}