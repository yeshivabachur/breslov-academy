import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function OfficeHours({ instructor }) {
  const slots = [
    { time: 'Sunday 7-8 PM', available: true, booked: 2, capacity: 5 },
    { time: 'Wednesday 8-9 PM', available: true, booked: 4, capacity: 5 },
    { time: 'Thursday 6-7 PM', available: false, booked: 5, capacity: 5 }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Video className="w-5 h-5 text-purple-600" />
          <div>
            <div>Office Hours</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">שעות קבלה</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Rabbi Cohen</div>
              <div className="text-sm text-slate-600">Available for 1-on-1 sessions</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border-2 ${
                slot.available 
                  ? 'bg-white border-slate-200' 
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="font-bold text-slate-900">{slot.time}</span>
                </div>
                <Badge className={slot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {slot.available ? 'Available' : 'Full'}
                </Badge>
              </div>
              <div className="text-xs text-slate-600 mb-3">
                {slot.booked} / {slot.capacity} spots filled
              </div>
              <Button
                disabled={!slot.available}
                size="sm"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
              >
                Book Slot
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}