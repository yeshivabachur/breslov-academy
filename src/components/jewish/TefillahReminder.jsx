import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function TefillahReminder() {
  const [currentTefillah, setCurrentTefillah] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkTefillahTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      const tefillos = [
        { name: 'Shacharit', nameHebrew: 'שחרית', start: 6, end: 10, icon: '🌅' },
        { name: 'Mincha', nameHebrew: 'מנחה', start: 15, end: 18, icon: '☀️' },
        { name: 'Maariv', nameHebrew: 'מעריב', start: 20, end: 22, icon: '🌙' }
      ];

      const current = tefillos.find(t => hour >= t.start && hour < t.end);
      if (current && !dismissed) {
        setCurrentTefillah(current);
      } else {
        setCurrentTefillah(null);
      }
    };

    checkTefillahTime();
    const interval = setInterval(checkTefillahTime, 60000);
    return () => clearInterval(interval);
  }, [dismissed]);

  if (!currentTefillah) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed bottom-24 right-4 z-50"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-xl w-80">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{currentTefillah.icon}</div>
                <div>
                  <div className="font-black text-slate-900">{currentTefillah.name}</div>
                  <div className="text-blue-700 font-serif" dir="rtl">{currentTefillah.nameHebrew}</div>
                </div>
              </div>
              <Bell className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
            
            <div className="text-sm text-slate-700 mb-4">
              Time for {currentTefillah.name} prayer
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDismissed(true)}
                className="flex-1 rounded-lg"
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  toast.success('May your prayers be accepted!');
                  setDismissed(true);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg"
              >
                <Check className="w-4 h-4 mr-2" />
                Prayed
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}