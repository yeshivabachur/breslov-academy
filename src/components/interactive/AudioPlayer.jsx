import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

export default function AudioPlayer({ title, src, duration = 0 }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900">{title || 'Audio Shiur'}</div>
            <Badge variant="outline" className="text-xs">Audio</Badge>
          </div>
        </div>

        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          className="w-full"
        />

        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full h-10 w-10 p-0">
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={togglePlay}
            size="lg"
            className="rounded-full h-14 w-14 p-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white"
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
          </Button>
          
          <Button variant="outline" size="sm" className="rounded-full h-10 w-10 p-0">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        <audio ref={audioRef} src={src} />
      </CardContent>
    </Card>
  );
}