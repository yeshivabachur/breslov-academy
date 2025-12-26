import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Type } from 'lucide-react';

export default function FontSizeController() {
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    const saved = localStorage.getItem('fontSize');
    if (saved) setFontSize(parseInt(saved));
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-2">
      <Type className="w-4 h-4 text-slate-600" />
      <Button
        onClick={() => setFontSize(Math.max(80, fontSize - 10))}
        variant="ghost"
        size="sm"
        className="rounded-lg font-bold"
      >
        A-
      </Button>
      <span className="text-sm font-bold text-slate-600 min-w-[3ch] text-center">
        {fontSize}%
      </span>
      <Button
        onClick={() => setFontSize(Math.min(150, fontSize + 10))}
        variant="ghost"
        size="sm"
        className="rounded-lg font-bold"
      >
        A+
      </Button>
    </div>
  );
}