import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Download, WifiOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function OfflineMode({ lessons = [] }) {
  const [downloaded, setDownloaded] = useState([]);
  const [downloading, setDownloading] = useState(null);

  const downloadLesson = (lessonId) => {
    setDownloading(lessonId);
    setTimeout(() => {
      setDownloaded([...downloaded, lessonId]);
      setDownloading(null);
    }, 2000);
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900">Offline Learning</h3>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-900">
            Download lessons to learn without internet connection
          </div>
        </div>

        <div className="space-y-2">
          {lessons.slice(0, 5).map((lesson, idx) => {
            const isDownloaded = downloaded.includes(lesson.id);
            const isDownloading = downloading === lesson.id;
            
            return (
              <div
                key={lesson.id}
                className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-sm">{lesson.title}</div>
                  <div className="text-xs text-slate-600">{lesson.duration_minutes} min</div>
                </div>
                
                {isDownloaded ? (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    Downloaded
                  </Badge>
                ) : isDownloading ? (
                  <Badge className="bg-blue-100 text-blue-800">
                    Downloading...
                  </Badge>
                ) : (
                  <Button
                    onClick={() => downloadLesson(lesson.id)}
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}