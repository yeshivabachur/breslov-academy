import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Type, Highlighter, MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SourceTextPanel({ sourceText, onAnnotate, onDiscuss }) {
  const [fontSize, setFontSize] = useState(16);
  const [selectedText, setSelectedText] = useState('');
  const [showActions, setShowActions] = useState(false);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text) {
      setSelectedText(text);
      setShowActions(true);
    } else {
      setShowActions(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border-2 border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Source Text</h3>
            <p className="text-xs text-slate-600">Primary Learning Material</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            className="rounded-lg"
          >
            <Type className="w-4 h-4" />
            <span className="ml-1">−</span>
          </Button>
          <span className="text-xs font-mono text-slate-600 w-8 text-center">{fontSize}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            className="rounded-lg"
          >
            <Type className="w-4 h-4" />
            <span className="ml-1">+</span>
          </Button>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="prose prose-lg max-w-none leading-relaxed"
          style={{ fontSize: `${fontSize}px` }}
          onMouseUp={handleTextSelection}
        >
          {sourceText?.hebrew && (
            <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
              <Badge className="mb-3 bg-blue-100 text-blue-800">עברית</Badge>
              <div 
                className="text-right font-serif leading-loose"
                style={{ fontSize: `${fontSize + 4}px` }}
                dir="rtl"
              >
                {sourceText.hebrew}
              </div>
            </div>
          )}

          {sourceText?.english && (
            <div className="mb-8">
              <Badge className="mb-3 bg-slate-100 text-slate-800">English Translation</Badge>
              <div className="font-serif text-slate-800 leading-relaxed">
                {sourceText.english}
              </div>
            </div>
          )}

          {sourceText?.commentary && (
            <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
              <Badge className="mb-3 bg-amber-200 text-amber-900">Commentary</Badge>
              <div className="font-sans text-slate-700 leading-relaxed text-sm">
                {sourceText.commentary}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selection Actions */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-slate-200 bg-slate-50"
        >
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                onAnnotate?.(selectedText);
                setShowActions(false);
              }}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-lg"
            >
              <Highlighter className="w-4 h-4 mr-2" />
              Annotate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onDiscuss?.(selectedText);
                setShowActions(false);
              }}
              className="flex-1 rounded-lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Discuss
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}