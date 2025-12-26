import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AudioPlayer({ title, duration = "45:30" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-600">Daily Shiur • {duration}</p>
          </div>

          <div className="space-y-2">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden cursor-pointer">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentTime}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-600 font-mono">
              <span>00:00</span>
              <span>{duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-xl"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="ghost"
              size="icon"
              className="rounded-full flex-shrink-0"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}