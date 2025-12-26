import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Calendar, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function WebinarRegistration({ webinar }) {
  const [registered, setRegistered] = useState(false);

  const event = webinar || {
    title: 'Breslov Teachings for Modern Life',
    instructor: 'Rabbi Cohen',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    duration: 90,
    registered: 156,
    maxCapacity: 200,
    topics: ['Joy', 'Prayer', 'Simplicity']
  };

  const spotsLeft = event.maxCapacity - event.registered;

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Video className="w-5 h-5 text-red-600" />
          Live Webinar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="text-2xl font-black text-slate-900 mb-2">{event.title}</div>
          <div className="text-slate-600">with {event.instructor}</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-bold text-slate-900">
                {event.date.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </div>
              <div className="text-xs text-slate-600">{event.duration} minutes</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-bold text-slate-900">{event.registered} registered</div>
              <div className="text-xs text-slate-600">{spotsLeft} spots remaining</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-700 mb-2">Topics</div>
          <div className="flex flex-wrap gap-2">
            {event.topics.map((topic, idx) => (
              <Badge key={idx} variant="outline">{topic}</Badge>
            ))}
          </div>
        </div>

        {!registered ? (
          <Button
            onClick={() => setRegistered(true)}
            size="lg"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl"
          >
            Register Now
          </Button>
        ) : (
          <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-300 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <div className="font-bold text-green-900 mb-1">You're Registered!</div>
            <div className="text-sm text-green-800">Check your email for the Zoom link</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}