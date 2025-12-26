import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Music, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DigitalDownloads({ resources = [] }) {
  const downloads = [
    {
      name: 'Azamra Prayer Card',
      type: 'pdf',
      size: '2.3 MB',
      downloads: 156
    },
    {
      name: 'Likutey Moharan Audio Collection',
      type: 'audio',
      size: '45.2 MB',
      downloads: 89
    },
    {
      name: 'Hebrew Vocabulary Flashcards',
      type: 'pdf',
      size: '5.1 MB',
      downloads: 234
    }
  ];

  const getIcon = (type) => {
    if (type === 'audio') return Music;
    if (type === 'video') return Video;
    return FileText;
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Download className="w-5 h-5 text-green-600" />
          <div>
            <div>Resources</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">משאבים</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {downloads.map((item, idx) => {
          const Icon = getIcon(item.type);
          
          return (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-green-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">{item.name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Badge variant="outline" className="text-xs uppercase">
                      {item.type}
                    </Badge>
                    <span>{item.size}</span>
                    <span>• {item.downloads} downloads</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg shrink-0"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}