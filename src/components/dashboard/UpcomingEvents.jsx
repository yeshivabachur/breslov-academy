import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UpcomingEvents() {
  const events = [
    {
      title: 'Live Kabbalah Class',
      date: 'Today, 8:00 PM',
      instructor: 'Rabbi Moshe Klein',
      attendees: 42,
      type: 'Live Class',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Shabbat Study Group',
      date: 'Friday, 6:00 PM',
      instructor: 'Sarah Cohen',
      attendees: 18,
      type: 'Study Group',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Talmud Deep Dive',
      date: 'Sunday, 10:00 AM',
      instructor: 'Rabbi David Levy',
      attendees: 35,
      type: 'Workshop',
      color: 'from-green-500 to-green-600'
    },
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ x: 4 }}
            className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-black text-slate-900 mb-1">{event.title}</h4>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
              </div>
              <Badge className={`bg-gradient-to-r ${event.color} text-white`}>
                {event.type}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{event.instructor}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <Users className="w-4 h-4" />
                <span className="font-bold">{event.attendees}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}