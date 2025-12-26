import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollText, BookOpen, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ParshaWeekly() {
  const parsha = {
    name: 'Vayeshev',
    hebrewName: 'וַיֵּשֶׁב',
    book: 'Bereishit',
    chapters: '37:1 - 40:23',
    summary: 'The story of Joseph and his dreams, his sale by his brothers, and his time in Egypt.',
    keyThemes: ['Dreams', 'Jealousy', 'Divine Providence', 'Tests of Faith'],
    haftarah: 'Amos 2:6-3:8'
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-green-600" />
          This Week's Parsha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-lg px-4 py-2">
            {parsha.book}
          </Badge>
          <div className="text-4xl font-black text-slate-900">
            {parsha.name}
          </div>
          <div className="text-2xl text-green-700 font-bold" dir="rtl">
            {parsha.hebrewName}
          </div>
          <div className="text-slate-600 font-medium">
            {parsha.chapters}
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-green-700" />
              <h4 className="font-bold text-green-900">Summary</h4>
            </div>
            <p className="text-slate-700 leading-relaxed">{parsha.summary}</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-blue-700" />
              <h4 className="font-bold text-blue-900">Key Themes</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {parsha.keyThemes.map((theme, idx) => (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                    {theme}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-sm text-slate-600 text-center">
            <span className="font-semibold">Haftarah:</span> {parsha.haftarah}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}