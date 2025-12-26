import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudyTimer({ onComplete }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('study'); // study, break

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <Card className="glass-effect border-0 premium-shadow rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Study Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-6">
          <motion.div
            animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
            className="text-6xl font-black text-slate-900 font-mono"
          >
            {formatTime(seconds)}
          </motion.div>
          
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => setIsActive(!isActive)}
              className={`rounded-full w-16 h-16 ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              className="rounded-full w-16 h-16"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>
          </div>

          <div className="text-sm text-slate-600">
            Total study time today: <span className="font-bold text-slate-900">{formatTime(seconds)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}