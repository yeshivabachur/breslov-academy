import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Video, FileText, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const mockResults = [
    { type: 'course', title: 'Introduction to Likutey Moharan', icon: BookOpen, category: 'Courses' },
    { type: 'lesson', title: 'The Power of Hitbodedut', icon: Video, category: 'Lessons' },
    { type: 'article', title: 'Understanding Simcha', icon: FileText, category: 'Articles' },
    { type: 'group', title: 'Daily Talmud Study Circle', icon: Users, category: 'Groups' },
  ];

  useEffect(() => {
    if (query.length > 2) {
      setResults(mockResults.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase())
      ));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, lessons, topics..."
          className="pl-12 pr-4 py-6 rounded-2xl text-lg border-2 border-slate-200 focus:border-blue-500 transition-colors"
        />
        {query && (
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 animate-pulse" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full z-50"
          >
            <Card className="glass-effect border-0 premium-shadow-xl rounded-2xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {results.map((result, idx) => {
                  const Icon = result.icon;
                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        onSelect?.(result);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="w-full p-4 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate">{result.title}</div>
                        <div className="text-xs text-slate-500">{result.category}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}