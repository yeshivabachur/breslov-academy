import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Pause, SkipForward, Volume2 } from 'lucide-react';

export default function ZemirotPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);

  const zemirot = [
    {
      name: 'Azamer Bishvachin',
      nameHebrew: 'אזמר בשבחין',
      occasion: 'Shabbat Morning',
      duration: '4:23'
    },
    {
      name: 'Yom Zeh LeYisrael',
      nameHebrew: 'יום זה לישראל',
      occasion: 'Shabbat Afternoon',
      duration: '3:56'
    },
    {
      name: 'Tzama Lecha Nafshi',
      nameHebrew: 'צמאה לך נפשי',
      occasion: 'Seudah Shlishit',
      duration: '5:12'
    }
  ];

  const currentZemer = zemirot[currentSong];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Music className="w-5 h-5 text-purple-600" />
          <div>
            <div>Shabbat Zemirot</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">זמירות שבת</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-2xl text-white text-center">
          <Music className="w-12 h-12 text-purple-300 mx-auto mb-3" />
          <div className="text-2xl font-black mb-1">{currentZemer.name}</div>
          <div className="text-xl text-purple-300 font-serif mb-3" dir="rtl">
            {currentZemer.nameHebrew}
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            {currentZemer.occasion}
          </Badge>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentSong((currentSong - 1 + zemirot.length) % zemirot.length)}
            className="rounded-full h-12 w-12 p-0"
          >
            <SkipForward className="w-5 h-5 rotate-180" />
          </Button>
          
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            size="lg"
            className="rounded-full h-16 w-16 p-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentSong((currentSong + 1) % zemirot.length)}
            className="rounded-full h-12 w-12 p-0"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold text-slate-700">Playlist</div>
          {zemirot.map((zemer, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentSong(idx)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                idx === currentSong 
                  ? 'bg-purple-50 border-purple-300' 
                  : 'bg-white border-slate-200 hover:border-purple-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{zemer.name}</div>
                  <div className="text-xs text-purple-700 font-serif" dir="rtl">{zemer.nameHebrew}</div>
                </div>
                <div className="text-xs text-slate-600">{zemer.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}