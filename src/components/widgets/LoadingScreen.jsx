import React from 'react';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <BookOpen className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="space-y-2"
        >
          <div className="text-xl font-black text-slate-900">{message}</div>
          <div className="text-sm text-slate-600 font-serif" dir="rtl">טוען...</div>
        </motion.div>
      </div>
    </div>
  );
}