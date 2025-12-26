import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, X, Clock, Eye } from 'lucide-react';

export default function StudyBreakReminder({ studyDuration = 0 }) {
  const [showBreak, setShowBreak] = useState(false);

  useEffect(() => {
    // Remind to take break every 45 minutes
    if (studyDuration > 0 && studyDuration % 45 === 0) {
      setShowBreak(true);
    }
  }, [studyDuration]);

  const dismiss = () => {
    setShowBreak(false);
  };

  return (
    <AnimatePresence>
      {showBreak && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
        >
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-2xl">
            <CardContent className="p-6 space-y-4 min-w-[350px]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Coffee className="w-10 h-10 text-amber-600" />
                  <div>
                    <div className="font-black text-slate-900 text-lg">Time for a Break!</div>
                    <div className="text-sm text-amber-800" dir="rtl">זמן להפסקה</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismiss}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-sm text-slate-700 space-y-2">
                <div>You've been studying for {studyDuration} minutes.</div>
                <div className="font-serif italic">
                  "Just as the body needs rest, so does the mind need breaks to absorb Torah wisdom"
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Quick Break Suggestions:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white rounded-lg border border-amber-200 text-xs text-center">
                    <Eye className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    Rest eyes
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-amber-200 text-xs text-center">
                    <Coffee className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                    Get water
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={dismiss}
                  className="flex-1 rounded-lg"
                >
                  Skip
                </Button>
                <Button
                  onClick={dismiss}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  5 Min Break
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}