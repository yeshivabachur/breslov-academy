import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Sunrise, Sunset, Moon, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HebrewCalendar() {
  const hebrewDate = "כ״ו כסלו ה׳תשפ״ה";
  const englishDate = "26 Kislev 5785";
  const parsha = "Vayeshev";
  
  const zmanim = [
    { name: 'Alot Hashachar', time: '5:42 AM', icon: Moon },
    { name: 'Sunrise', time: '7:08 AM', icon: Sunrise },
    { name: 'Latest Shema', time: '9:32 AM', icon: Star },
    { name: 'Chatzot', time: '11:50 AM', icon: Sun },
    { name: 'Sunset', time: '4:32 PM', icon: Sunset },
    { name: 'Tzet Hakochavim', time: '5:12 PM', icon: Moon },
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Hebrew Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl font-black text-slate-900" dir="rtl">
            {hebrewDate}
          </div>
          <div className="text-xl text-slate-600 font-semibold">
            {englishDate}
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            Parashat {parsha}
          </Badge>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Zmanim</h4>
          <div className="grid gap-2">
            {zmanim.map((zman, idx) => {
              const Icon = zman.icon;
              return (
                <motion.div
                  key={zman.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-600" />
                    <span className="font-medium text-slate-700">{zman.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{zman.time}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}