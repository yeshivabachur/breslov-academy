import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Search } from 'lucide-react';

export default function TranscriptPanel({ lesson }) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: transcripts = [] } = useQuery({
    queryKey: ['transcript', lesson.id],
    queryFn: () => base44.entities.Transcript.filter({ lesson_id: lesson.id }),
    enabled: !!lesson
  });

  const transcript = transcripts[0];
  
  const highlightText = (text) => {
    if (!searchQuery || !text) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-amber-200">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Transcript
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!transcript ? (
          <p className="text-sm text-slate-500 text-center py-4">No transcript available</p>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transcript..."
                className="pl-10"
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto p-4 bg-slate-50 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {highlightText(transcript.text)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}