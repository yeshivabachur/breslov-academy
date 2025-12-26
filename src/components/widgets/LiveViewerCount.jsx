import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveViewerCount({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Badge className="bg-red-600 text-white flex items-center gap-2 px-3 py-1.5">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <Eye className="w-4 h-4" />
        <span className="font-bold">{count}</span>
      </Badge>
    </motion.div>
  );
}