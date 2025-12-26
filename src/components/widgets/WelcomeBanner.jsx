import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';

export default function WelcomeBanner({ userName, onDismiss }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-0 shadow-2xl rounded-[2rem] mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                  <div className="text-2xl font-black text-white">
                    Welcome, {userName}!
                  </div>
                </div>
                <p className="text-blue-100 mb-4">
                  Begin your sacred journey through Breslov teachings. May your learning bring light and joy.
                </p>
                <div className="text-lg text-amber-300 font-serif" dir="rtl">
                  ברוך הבא! מצוה גדולה להיות בשמחה תמיד
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setVisible(false);
                  onDismiss?.();
                }}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}