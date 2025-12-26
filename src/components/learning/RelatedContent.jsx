import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, BookOpen, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RelatedContent({ currentLesson }) {
  const related = [
    {
      type: 'lesson',
      title: 'Advanced Azamra Teachings',
      duration: '45 min',
      connection: 'Continues this concept'
    },
    {
      type: 'discussion',
      title: 'Community Q&A on Finding Good',
      replies: 23,
      connection: 'Related discussion'
    },
    {
      type: 'resource',
      title: 'Azamra Prayer Card PDF',
      size: '2.3 MB',
      connection: 'Practical resource'
    }
  ];

  const getIcon = (type) => {
    if (type === 'lesson') return Play;
    if (type === 'discussion') return Link2;
    return BookOpen;
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Link2 className="w-5 h-5 text-purple-600" />
          <div>
            <div>Related Content</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">תוכן קשור</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {related.map((item, idx) => {
          const Icon = getIcon(item.type);
          
          return (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-purple-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">{item.title}</div>
                  <div className="text-xs text-purple-600 mb-2">{item.connection}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.type}
                    </Badge>
                    {item.duration && (
                      <span className="text-xs text-slate-600">{item.duration}</span>
                    )}
                    {item.replies && (
                      <span className="text-xs text-slate-600">{item.replies} replies</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}