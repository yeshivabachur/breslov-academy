import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle, Trash2, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineDownload({ lessons, onDownload, onDelete }) {
  const [downloads, setDownloads] = useState([]);
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (lessonId) => {
    setDownloading(lessonId);
    await onDownload?.(lessonId);
    setDownloads([...downloads, lessonId]);
    setDownloading(null);
  };

  const totalSize = downloads.length * 150; // Estimate 150MB per lesson

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            Offline Downloads
          </CardTitle>
          <Badge variant="outline">
            <HardDrive className="w-3 h-3 mr-1" />
            {totalSize} MB
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-slate-700">
            Download lessons to watch offline. Perfect for studying on the go!
          </p>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {lessons?.map((lesson, idx) => {
              const isDownloaded = downloads.includes(lesson.id);
              const isDownloading = downloading === lesson.id;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center justify-between p-4 bg-white rounded-xl"
                >
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{lesson.title}</div>
                    <div className="text-sm text-slate-600">
                      {lesson.duration_minutes} min • ~150 MB
                    </div>
                  </div>

                  {isDownloaded ? (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Downloaded
                      </Badge>
                      <Button
                        onClick={() => {
                          onDelete?.(lesson.id);
                          setDownloads(downloads.filter(id => id !== lesson.id));
                        }}
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleDownload(lesson.id)}
                      disabled={isDownloading}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}