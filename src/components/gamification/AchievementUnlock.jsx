import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export default function AchievementUnlock({ achievement, onClose }) {
  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 p-8 shadow-2xl">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            />
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="relative text-center space-y-6">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center"
              >
                <div className="relative">
                  <Trophy className="w-24 h-24 text-white drop-shadow-2xl" />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sparkles className="w-32 h-32 text-yellow-200" />
                  </motion.div>
                </div>
              </motion.div>

              <div>
                <h2 className="text-4xl font-black text-white mb-2">
                  Achievement Unlocked!
                </h2>
                <h3 className="text-2xl font-bold text-white/90 mb-4">
                  {achievement?.title || 'Torah Scholar'}
                </h3>
                <p className="text-white/80 text-lg">
                  {achievement?.description || 'Completed 10 lessons with excellence'}
                </p>
              </div>

              <div className="flex justify-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white font-bold">+{achievement?.xp || 100} XP</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white font-bold">🎖️ Badge Earned</span>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="bg-white text-amber-600 hover:bg-white/90 font-bold rounded-2xl px-8 py-6 text-lg"
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}