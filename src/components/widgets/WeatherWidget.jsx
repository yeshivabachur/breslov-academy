import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Sun, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeatherWidget() {
  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-slate-900">72°F</div>
            <div className="text-slate-600 font-medium">Jerusalem</div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sun className="w-12 h-12 text-amber-500" />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}