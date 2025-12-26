import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <Badge className="bg-orange-600 text-white px-4 py-2 shadow-xl">
            <WifiOff className="w-4 h-4 mr-2" />
            You're offline - Using cached content
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}