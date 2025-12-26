import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, X, BookOpen } from 'lucide-react';

export default function DailyReminder({ userPreferences }) {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Show reminder at preferred study time
      if (hour === (userPreferences?.studyHour || 9)) {
        setShowReminder(true);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [userPreferences]);

  return (
    <AnimatePresence>
      {showReminder && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-24 right-4 z-50"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-2xl w-80">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-black text-slate-900">Study Time!</div>
                    <div className="text-sm text-blue-700" dir="rtl">עת ללמוד</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReminder(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-sm text-slate-700 mb-4 font-serif">
                Your daily learning time has arrived. Continue your Torah journey!
              </p>

              <Button
                onClick={() => setShowReminder(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl"
              >
                Start Learning
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}