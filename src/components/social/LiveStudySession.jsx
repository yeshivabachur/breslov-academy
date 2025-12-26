import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Video, MessageCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveStudySession() {
  const [liveSessions, setLiveSessions] = useState([
    {
      id: 1,
      title: 'Likutey Moharan Study Circle',
      instructor: 'Rabbi Cohen',
      participants: 12,
      topic: 'Torah 1',
      startTime: new Date(Date.now() + 30 * 60000),
      isLive: false
    },
    {
      id: 2,
      title: 'Evening Talmud Shiur',
      instructor: 'Rabbi Levy',
      participants: 24,
      topic: 'Berachot 2a',
      startTime: new Date(),
      isLive: true
    },
    {
      id: 3,
      title: 'Breslov Chassidus Deep Dive',
      instructor: 'Rabbi Katz',
      participants: 8,
      topic: 'Simplicity & Joy',
      startTime: new Date(Date.now() + 120 * 60000),
      isLive: false
    }
  ]);

  const formatTimeUntil = (date) => {
    const diff = date - new Date();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 0) return 'Live Now';
    if (hours > 0) return `in ${hours}h ${minutes % 60}m`;
    return `in ${minutes}m`;
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Video className="w-5 h-5 text-red-600" />
          <div>
            <div>Live Study Sessions</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">שיעורים חיים</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {liveSessions.map((session, idx) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-xl border-2 transition-all ${
              session.isLive 
                ? 'bg-red-50 border-red-300 animate-pulse' 
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900">{session.title}</h4>
                  {session.isLive && (
                    <Badge className="bg-red-600 text-white text-xs animate-pulse">
                      LIVE
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-slate-600">
                  with {session.instructor}
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">{session.participants}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                {session.topic}
              </Badge>
              {!session.isLive && (
                <Badge variant="outline" className="text-xs">
                  {formatTimeUntil(session.startTime)}
                </Badge>
              )}
            </div>

            <Button
              className={`w-full rounded-xl ${
                session.isLive 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
              }`}
            >
              <Video className="w-4 h-4 mr-2" />
              {session.isLive ? 'Join Now' : 'Set Reminder'}
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}