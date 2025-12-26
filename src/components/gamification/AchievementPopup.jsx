import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Award, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export default function AchievementPopup({ achievement, onClose }) {
  const [show, setShow] = useState(!!achievement);

  useEffect(() => {
    if (achievement) {
      setShow(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {show && achievement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <Card className="bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 border-4 border-amber-200 shadow-2xl min-w-[400px]">
            <CardContent className="p-8 text-center relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShow(false);
                  onClose?.();
                }}
                className="absolute top-2 right-2 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Award className="w-24 h-24 text-white mx-auto mb-4" />
              </motion.div>
              
              <div className="text-4xl font-black text-white mb-2">
                Achievement Unlocked!
              </div>
              <div className="text-2xl text-amber-900 font-serif mb-4" dir="rtl">
                הישג חדש!
              </div>
              
              <div className="bg-white/90 rounded-2xl p-4 mb-4">
                <div className="text-2xl font-black text-slate-900 mb-2">
                  {achievement.name}
                </div>
                <div className="text-slate-700">
                  {achievement.description}
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-white font-bold">
                <Award className="w-5 h-5" />
                <span>+{achievement.points} XP</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}