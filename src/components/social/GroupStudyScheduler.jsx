import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Users, Plus, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GroupStudyScheduler({ groupId }) {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: 'Likutey Moharan Study',
      date: new Date(Date.now() + 86400000),
      time: '20:00',
      duration: 90,
      attendees: 6,
      topic: 'Torah 1',
      recurring: 'weekly'
    },
    {
      id: 2,
      title: 'Talmud Chavruta',
      date: new Date(Date.now() + 172800000),
      time: '19:00',
      duration: 60,
      attendees: 4,
      topic: 'Berachot 2a',
      recurring: 'twice-weekly'
    }
  ]);

  const [newSession, setNewSession] = useState({
    title: '',
    time: '',
    duration: 60
  });

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <div>Study Schedule</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">לוח זמנים</div>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {sessions.map((session, idx) => (
            <div
              key={session.id}
              className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-black text-slate-900 mb-1">{session.title}</div>
                  <Badge variant="outline" className="text-xs">
                    {session.topic}
                  </Badge>
                </div>
                <Badge className="bg-blue-100 text-blue-800 capitalize">
                  {session.recurring}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{session.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>{session.attendees}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-lg"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-900 font-serif">
            📅 <strong>Pro Tip:</strong> Schedule recurring sessions for Kvius Itim - fixed Torah study times
          </div>
        </div>
      </CardContent>
    </Card>
  );
}