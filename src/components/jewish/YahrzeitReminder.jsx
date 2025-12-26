import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Flame, Plus, Bell, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function YahrzeitReminder() {
  const [yahrzeits, setYahrzeits] = useState([
    {
      name: 'Rebbe Nachman of Breslov',
      hebrewDate: '18 Tishrei',
      gregorianDate: 'October 16, 2025',
      daysUntil: 45,
      type: 'tzaddik'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Flame className="w-5 h-5 text-blue-600" />
            <div>
              <div>Yahrzeit Calendar</div>
              <div className="text-sm text-slate-600 font-normal" dir="rtl">לוח יארצייט</div>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            variant="outline"
            className="rounded-lg"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3">
            <Input placeholder="Name" className="rounded-lg" />
            <Input placeholder="Hebrew date (e.g., 3 Tishrei)" className="rounded-lg" />
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl">
              Add Yahrzeit
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {yahrzeits.map((yahrzeit, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border-2 border-slate-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-slate-900">{yahrzeit.name}</div>
                  <div className="text-sm text-slate-600 mt-1" dir="rtl">
                    {yahrzeit.hebrewDate}
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {yahrzeit.type}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {yahrzeit.gregorianDate}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {yahrzeit.daysUntil} days
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-lg"
              >
                <Bell className="w-4 h-4 mr-2" />
                Set Reminder
              </Button>
            </div>
          ))}
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="text-sm text-purple-900 font-serif leading-relaxed">
            "On a yahrzeit, the neshamah (soul) ascends to higher spiritual levels. Learning Torah and doing mitzvot elevate the departed."
          </div>
        </div>
      </CardContent>
    </Card>
  );
}