import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Highlighter, MessageCircle, BookmarkPlus } from 'lucide-react';

export default function TextHighlighter({ selectedText, onHighlight, onNote, onBookmark }) {
  const [color, setColor] = useState('yellow');
  
  const colors = [
    { name: 'yellow', class: 'bg-yellow-200' },
    { name: 'green', class: 'bg-green-200' },
    { name: 'blue', class: 'bg-blue-200' },
    { name: 'pink', class: 'bg-pink-200' },
    { name: 'purple', class: 'bg-purple-200' }
  ];

  if (!selectedText) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-white rounded-2xl border-2 border-slate-300 shadow-2xl p-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-lg">
              <Highlighter className="w-4 h-4 mr-2" />
              Highlight
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="grid grid-cols-5 gap-2">
              {colors.map(c => (
                <button
                  key={c.name}
                  onClick={() => {
                    setColor(c.name);
                    onHighlight?.(selectedText, c.name);
                  }}
                  className={`w-8 h-8 rounded-lg border-2 ${c.class} ${
                    color === c.name ? 'border-slate-900 scale-110' : 'border-slate-200'
                  }`}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNote?.(selectedText)}
          className="rounded-lg"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Note
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onBookmark?.(selectedText)}
          className="rounded-lg"
        >
          <BookmarkPlus className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}