import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookA, Volume2, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VocabularyBuilder() {
  const [words] = useState([
    { hebrew: 'שמחה', transliteration: 'Simcha', english: 'Joy/Happiness', mastered: true },
    { hebrew: 'תפילה', transliteration: 'Tefillah', english: 'Prayer', mastered: true },
    { hebrew: 'חסד', transliteration: 'Chesed', english: 'Kindness', mastered: false },
    { hebrew: 'אמונה', transliteration: 'Emunah', english: 'Faith', mastered: false },
  ]);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookA className="w-5 h-5 text-teal-600" />
          Hebrew Vocabulary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {words.map((word, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ x: 4 }}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl font-bold" dir="rtl">{word.hebrew}</div>
                    {word.mastered && <Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                  </div>
                  <div className="text-sm text-slate-600 mb-1">{word.transliteration}</div>
                  <div className="text-slate-900 font-medium">{word.english}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Volume2 className="w-4 h-4 text-slate-600" />
                  </Button>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Mastery Progress</span>
            <span className="font-bold text-slate-900">
              {words.filter(w => w.mastered).length} / {words.length}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(words.filter(w => w.mastered).length / words.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}