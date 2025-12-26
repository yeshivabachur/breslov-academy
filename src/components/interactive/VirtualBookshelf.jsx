import React from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VirtualBookshelf({ books }) {
  const mockBooks = books || [
    { title: 'Likutey Moharan', color: 'from-amber-500 to-amber-700', unlocked: true },
    { title: 'Torah Or', color: 'from-blue-500 to-blue-700', unlocked: true },
    { title: 'Zohar', color: 'from-purple-500 to-purple-700', unlocked: false },
    { title: 'Talmud Bavli', color: 'from-green-500 to-green-700', unlocked: true },
    { title: 'Shulchan Aruch', color: 'from-red-500 to-red-700', unlocked: false },
    { title: 'Mishnah', color: 'from-indigo-500 to-indigo-700', unlocked: true },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-black text-slate-900">My Library</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {mockBooks.map((book, idx) => (
          <motion.div
            key={book.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -8, rotate: 2 }}
            className="relative"
          >
            <div className={`h-48 rounded-2xl bg-gradient-to-br ${book.color} shadow-xl cursor-pointer p-4 flex flex-col justify-between ${!book.unlocked && 'opacity-50'}`}>
              <div className="flex justify-between items-start">
                <BookOpen className="w-6 h-6 text-white/80" />
                {!book.unlocked && <Lock className="w-5 h-5 text-white/80" />}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-tight">{book.title}</h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}