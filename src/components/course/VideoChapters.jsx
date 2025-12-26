import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, BookOpen, CheckCircle } from 'lucide-react';

export default function VideoChapters({ chapters = [], currentTime, onJumpTo, completedChapters = [] }) {
  const defaultChapters = [
    { id: 1, title: 'Introduction to Azamra', startTime: 0, duration: 180 },
    { id: 2, title: 'The Story and Context', startTime: 180, duration: 240 },
    { id: 3, title: 'Finding the Good Point', startTime: 420, duration: 300 },
    { id: 4, title: 'Practical Applications', startTime: 720, duration: 280 },
    { id: 5, title: 'Summary and Reflection', startTime: 1000, duration: 120 }
  ];

  const activeChapters = chapters.length > 0 ? chapters : defaultChapters;

  const getCurrentChapter = () => {
    return activeChapters.find((ch, idx) => {
      const nextChapter = activeChapters[idx + 1];
      return currentTime >= ch.startTime && (!nextChapter || currentTime < nextChapter.startTime);
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const current = getCurrentChapter();

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-black text-slate-900">Video Chapters</h3>
        </div>

        <div className="space-y-2">
          {activeChapters.map((chapter, idx) => {
            const isCompleted = completedChapters.includes(chapter.id);
            const isCurrent = current?.id === chapter.id;
            
            return (
              <div
                key={chapter.id}
                onClick={() => onJumpTo?.(chapter.startTime)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  isCurrent 
                    ? 'bg-blue-50 border-blue-300 shadow-md' 
                    : isCompleted
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-slate-200 hover:border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isCurrent 
                      ? 'bg-blue-600' 
                      : isCompleted
                      ? 'bg-green-600'
                      : 'bg-slate-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <Play className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white font-bold text-sm">{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-bold text-slate-900 mb-1">{chapter.title}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {formatTime(chapter.startTime)}
                      </Badge>
                      <span className="text-xs text-slate-600">
                        {Math.floor(chapter.duration / 60)} min
                      </span>
                    </div>
                  </div>

                  {isCurrent && (
                    <Badge className="bg-blue-600 text-white animate-pulse">
                      Playing
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}