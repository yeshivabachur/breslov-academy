import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

export default function StudyMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTrack, setCurrentTrack] = useState(0);

  const playlists = [
    {
      name: 'Niggunim for Learning',
      nameHebrew: 'ניגונים ללימוד',
      tracks: ['Azamer Bishvachin', 'Shalom Aleichem', 'Yedid Nefesh']
    },
    {
      name: 'Ambient Torah Study',
      nameHebrew: 'אווירה לתורה',
      tracks: ['Beis Midrash Sounds', 'Gentle Chanting', 'Torah Cantillation']
    },
    {
      name: 'Focus & Concentration',
      nameHebrew: 'ריכוז והתמקדות',
      tracks: ['White Noise', 'Nature Sounds', 'Soft Rain']
    }
  ];

  const [selectedPlaylist, setSelectedPlaylist] = useState(0);
  const playlist = playlists[selectedPlaylist];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-600" />
          <h3 className="font-black text-slate-900">Study Music</h3>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-xl text-white">
          <div className="text-sm opacity-80 mb-2">Now Playing</div>
          <div className="text-lg font-black mb-1">{playlist.name}</div>
          <div className="text-sm text-purple-300 font-serif" dir="rtl">{playlist.nameHebrew}</div>
          <div className="text-xs opacity-70 mt-2">
            Track {currentTrack + 1}: {playlist.tracks[currentTrack]}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full h-12 w-12 p-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {volume > 0 ? (
                <Volume2 className="w-4 h-4 text-slate-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-600" />
              )}
              <span className="text-slate-700">Volume</span>
            </div>
            <span className="text-slate-900 font-bold">{volume}%</span>
          </div>
          <Slider
            value={[volume]}
            onValueChange={(v) => setVolume(v[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          {playlists.map((pl, idx) => (
            <Button
              key={idx}
              onClick={() => setSelectedPlaylist(idx)}
              variant={selectedPlaylist === idx ? 'default' : 'outline'}
              size="sm"
              className="flex-1 rounded-lg text-xs"
            >
              {pl.name.split(' ')[0]}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}