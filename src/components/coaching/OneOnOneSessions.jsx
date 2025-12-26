import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Video, Clock, User, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OneOnOneSessions({ instructor, availableSlots, onBook }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const times = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '2:00 PM', '3:00 PM', '4:00 PM',
    '7:00 PM', '8:00 PM'
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 font-serif mb-1">
              Private Session with {instructor?.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Badge className="bg-purple-100 text-purple-800 font-serif">1-on-1 Mentorship</Badge>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                60 minutes
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 font-serif">Select Date</h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-2xl border-2 border-slate-200 p-3"
            />
          </div>

          {/* Time Slots */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 font-serif">Select Time</h4>
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {times.map((time, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTime(time)}
                  disabled={!selectedDate}
                  className={`p-3 rounded-xl text-sm font-serif transition-all ${
                    selectedTime === time
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border-2 border-slate-200 hover:border-purple-300'
                  } ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedDate && selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200"
          >
            <div className="flex items-center gap-2 text-purple-900 mb-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold font-serif">Session Confirmed</span>
            </div>
            <div className="text-sm text-purple-800 font-serif">
              {selectedDate.toLocaleDateString()} at {selectedTime}
            </div>
          </motion.div>
        )}

        <Button
          onClick={() => onBook?.({ date: selectedDate, time: selectedTime })}
          disabled={!selectedDate || !selectedTime}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-6 rounded-2xl font-serif"
        >
          <Video className="w-5 h-5 mr-2" />
          Book Session ($150)
        </Button>
      </CardContent>
    </Card>
  );
}