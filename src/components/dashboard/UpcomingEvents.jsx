import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Video, Users, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function UpcomingEvents() {
  const events = [
    {
      title: 'Live Shiur: Likutey Moharan Torah 5',
      instructor: 'Rabbi Cohen',
      date: new Date(Date.now() + 3600000),
      type: 'live_class',
      attendees: 45
    },
    {
      title: 'Chavruta Study Session',
      instructor: 'Study Group',
      date: new Date(Date.now() + 86400000),
      type: 'study_group',
      attendees: 6
    },
    {
      title: 'Parshah Webinar',
      instructor: 'Rabbi Levy',
      date: new Date(Date.now() + 172800000),
      type: 'webinar',
      attendees: 120
    }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Calendar className="w-5 h-5 text-purple-600" />
          <div>
            <div>Upcoming Events</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">אירועים קרובים</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event, idx) => {
          const timeUntil = event.date - new Date();
          const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
          
          return (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-purple-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">{event.title}</div>
                  <div className="text-sm text-slate-600">{event.instructor}</div>
                </div>
                {hoursUntil < 2 && (
                  <Badge className="bg-red-100 text-red-800 animate-pulse">
                    Soon
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {event.attendees}
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-lg"
              >
                <Bell className="w-4 h-4 mr-2" />
                Remind Me
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}