import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DailyReminder() {
  const [enabled, setEnabled] = useState(true);
  const [time, setTime] = useState('20:00');

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {enabled ? <Bell className="w-5 h-5 text-blue-600" /> : <BellOff className="w-5 h-5 text-slate-400" />}
          Daily Study Reminder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-bold text-slate-900">Reminder Time</div>
              <div className="text-sm text-slate-600">Daily notification</div>
            </div>
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="px-3 py-2 bg-white rounded-lg border-2 border-slate-200 font-mono font-bold text-slate-900"
          />
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => setEnabled(!enabled)}
            className={`w-full rounded-2xl font-bold ${
              enabled
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {enabled ? 'Reminders Enabled' : 'Enable Reminders'}
          </Button>
        </motion.div>

        <div className="text-xs text-slate-500 text-center">
          We'll remind you to continue your learning journey every day at {time}
        </div>
      </CardContent>
    </Card>
  );
}