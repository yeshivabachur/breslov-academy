import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Search, Download, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InteractiveTranscript({ transcript, currentTime, onSeek }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredTranscript = transcript?.filter(line =>
    line.text.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getCurrentLine = () => {
    return transcript?.find((line, idx) => {
      const nextLine = transcript[idx + 1];
      return currentTime >= line.start && (!nextLine || currentTime < nextLine.start);
    });
  };

  const currentLine = getCurrentLine();

  const copyTranscript = () => {
    const text = transcript.map(l => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTranscript = () => {
    const text = transcript.map(l => `[${formatTime(l.start)}] ${l.text}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    a.click();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Interactive Transcript
          </div>
          <div className="flex gap-2">
            <Button
              onClick={copyTranscript}
              variant="outline"
              size="sm"
              className="rounded-xl"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              onClick={downloadTranscript}
              variant="outline"
              size="sm"
              className="rounded-xl"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcript..."
            className="pl-10 rounded-xl"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {(searchQuery ? filteredTranscript : transcript)?.map((line, idx) => {
            const isActive = currentLine?.start === line.start;
            
            return (
              <motion.button
                key={idx}
                onClick={() => onSeek?.(line.start)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-white hover:bg-slate-50 border-2 border-transparent'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-xs font-mono shrink-0 ${
                    isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
                  }`}>
                    {formatTime(line.start)}
                  </span>
                  <span className={`text-sm ${
                    isActive ? 'text-slate-900 font-medium' : 'text-slate-700'
                  }`}>
                    {searchQuery ? (
                      <HighlightText text={line.text} highlight={searchQuery} />
                    ) : (
                      line.text
                    )}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function HighlightText({ text, highlight }) {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}