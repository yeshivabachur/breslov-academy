import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronLeft, ChevronRight, Bookmark, Highlighter, Type, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteractiveEbook({ ebook, onProgress }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [highlights, setHighlights] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const pages = ebook?.pages || [];
  const page = pages[currentPage];

  const addHighlight = () => {
    const selection = window.getSelection();
    const text = selection.toString();
    if (text) {
      setHighlights([...highlights, { text, page: currentPage }]);
    }
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter(b => b !== currentPage));
    } else {
      setBookmarks([...bookmarks, currentPage]);
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] max-w-4xl mx-auto">
      <CardContent className="p-0">
        {/* Reader Controls */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 font-serif">{ebook?.title}</h3>
              <p className="text-sm text-slate-600">Page {currentPage + 1} of {pages.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
            >
              <Type className="w-4 h-4" />−
            </Button>
            <span className="text-sm font-mono w-8 text-center">{fontSize}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            >
              <Type className="w-4 h-4" />+
            </Button>

            <div className="w-px h-6 bg-slate-300 mx-2" />

            <Button
              variant="ghost"
              size="sm"
              onClick={addHighlight}
            >
              <Highlighter className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className={bookmarks.includes(currentPage) ? 'text-amber-600' : ''}
            >
              <Bookmark className={`w-4 h-4 ${bookmarks.includes(currentPage) ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-12 min-h-[600px] bg-gradient-to-b from-white to-slate-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="prose prose-lg max-w-none font-serif"
              style={{ fontSize: `${fontSize}px` }}
            >
              {page?.title && (
                <h2 className="text-3xl font-black text-slate-900 mb-6">{page.title}</h2>
              )}
              
              {page?.content_hebrew && (
                <div className="p-6 bg-blue-50 rounded-xl mb-6" dir="rtl">
                  <div className="text-xl leading-relaxed">{page.content_hebrew}</div>
                </div>
              )}

              {page?.content && (
                <div className="text-slate-800 leading-relaxed">
                  {page.content}
                </div>
              )}

              {page?.footnotes && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="text-sm text-slate-600 space-y-2">
                    {page.footnotes.map((note, idx) => (
                      <div key={idx}>
                        <sup className="text-blue-600 font-bold">{idx + 1}</sup> {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <Button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            variant="outline"
            className="rounded-xl font-serif"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={currentPage + 1}
              onChange={(e) => {
                const page = parseInt(e.target.value) - 1;
                if (page >= 0 && page < pages.length) {
                  setCurrentPage(page);
                }
              }}
              className="w-20 text-center rounded-lg"
            />
            <span className="text-slate-600">/ {pages.length}</span>
          </div>

          <Button
            onClick={() => {
              const next = Math.min(pages.length - 1, currentPage + 1);
              setCurrentPage(next);
              onProgress?.(next);
            }}
            disabled={currentPage === pages.length - 1}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-serif"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}