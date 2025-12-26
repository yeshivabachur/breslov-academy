import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, MessageCircle, Video, Calendar, Award } from 'lucide-react';

export default function MentorConnection({ mentor }) {
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');

  const defaultMentor = {
    name: 'Rabbi Cohen',
    title: 'Master of Likutey Moharan',
    bio: '25 years teaching Breslov chassidus',
    availability: 'Sundays 7-9 PM',
    specialties: ['Likutey Moharan', 'Hisbodedus', 'Tikkun HaKlali'],
    students: 15,
    rating: 5.0,
    sessionsHeld: 143
  };

  const activeMentor = mentor || defaultMentor;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <User className="w-5 h-5 text-purple-600" />
          <div>
            <div>Your Mentor</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">המנחה שלך</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-3">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{activeMentor.name}</div>
            <div className="text-purple-700 font-serif">{activeMentor.title}</div>
          </div>
          <p className="text-sm text-slate-600">{activeMentor.bio}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <div className="text-2xl font-black text-slate-900">{activeMentor.students}</div>
            <div className="text-xs text-slate-600">Students</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <div className="text-2xl font-black text-slate-900">{activeMentor.rating}</div>
            <div className="text-xs text-slate-600">Rating</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <div className="text-2xl font-black text-slate-900">{activeMentor.sessionsHeld}</div>
            <div className="text-xs text-slate-600">Sessions</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold text-slate-700">Specialties</div>
          <div className="flex flex-wrap gap-2">
            {activeMentor.specialties.map((specialty, idx) => (
              <Badge key={idx} className="bg-purple-100 text-purple-800">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-900">
            <Calendar className="w-4 h-4" />
            <span><strong>Available:</strong> {activeMentor.availability}</span>
          </div>
        </div>

        {!messageOpen ? (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setMessageOpen(true)}
              variant="outline"
              className="rounded-xl"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
            >
              <Video className="w-4 h-4 mr-2" />
              Book Session
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question or request guidance..."
              className="min-h-[100px] rounded-xl font-serif"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMessageOpen(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log('Sending message:', message);
                  setMessage('');
                  setMessageOpen(false);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl"
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}