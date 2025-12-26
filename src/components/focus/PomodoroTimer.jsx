import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function PomodoroTimer({ onSessionComplete }) {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval = null;
    
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(t => t - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (!isBreak) {
        setSessions(sessions + 1);
        onSessionComplete?.();
      }
      setIsBreak(!isBreak);
      setTime(isBreak ? 25 * 60 : 5 * 60);
    }

    return () => clearInterval(interval);
  }, [isActive, time, isBreak, sessions]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalTime - time) / totalTime) * 100;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-8 text-center space-y-6">
        <Badge className={isBreak ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
          {isBreak ? 'Break Time' : 'Focus Time'}
        </Badge>

        <div className={`w-48 h-48 mx-auto rounded-full ${
          isBreak ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-blue-400 to-indigo-600'
        } flex items-center justify-center shadow-2xl`}>
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
            <div className="text-6xl font-black text-slate-900 font-mono">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex gap-3">
          <Button
            onClick={() => setIsActive(!isActive)}
            size="lg"
            className={`flex-1 rounded-2xl ${
              isBreak 
                ? 'bg-gradient-to-r from-green-600 to-emerald-700' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700'
            } text-white`}
          >
            {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button
            onClick={() => {
              setTime(25 * 60);
              setIsActive(false);
              setIsBreak(false);
            }}
            variant="outline"
            size="lg"
            className="rounded-2xl"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Coffee className="w-4 h-4 text-slate-600" />
          <span className="text-sm text-slate-600">
            Sessions today: <span className="font-bold text-slate-900">{sessions}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}