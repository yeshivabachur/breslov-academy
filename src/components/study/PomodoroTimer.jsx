import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressRing from '@/components/ui/progress-ring';

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, break
  const [sessions, setSessions] = useState(0);

  const workTime = 25 * 60;
  const breakTime = 5 * 60;

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            if (mode === 'work') {
              setSessions(s => s + 1);
              setMode('break');
              setMinutes(5);
            } else {
              setMode('work');
              setMinutes(25);
            }
            setIsActive(false);
          } else {
            setMinutes(m => m - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const reset = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(25);
    setSeconds(0);
  };

  const totalSeconds = mode === 'work' ? workTime : breakTime;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] overflow-hidden">
      <div className={`p-8 bg-gradient-to-br ${mode === 'work' ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'} transition-all duration-500`}>
        <div className="text-center space-y-6">
          <motion.div
            key={mode}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center gap-2 text-white"
          >
            {mode === 'work' ? <BookOpen className="w-6 h-6" /> : <Coffee className="w-6 h-6" />}
            <span className="text-xl font-bold">
              {mode === 'work' ? 'Study Time' : 'Break Time'}
            </span>
          </motion.div>

          <div className="flex justify-center">
            <ProgressRing 
              progress={progress}
              size={200}
              strokeWidth={12}
              color="#FFFFFF"
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-7xl font-black text-white font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={() => setIsActive(!isActive)}
              className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/50"
              size="lg"
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/50"
              size="lg"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>
          </div>

          <div className="text-white/90 text-sm font-medium">
            Sessions completed today: <span className="text-2xl font-bold ml-2">{sessions}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}