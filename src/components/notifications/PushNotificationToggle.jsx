import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function PushNotificationToggle() {
  const [settings, setSettings] = useState({
    lessonReminders: true,
    achievements: true,
    messages: true,
    liveEvents: true,
    dailyWisdom: false
  });

  const notifications = [
    { key: 'lessonReminders', label: 'Lesson Reminders', description: 'Daily study time notifications' },
    { key: 'achievements', label: 'Achievements', description: 'Badge unlocks and milestones' },
    { key: 'messages', label: 'Messages', description: 'New messages from instructors' },
    { key: 'liveEvents', label: 'Live Events', description: 'Upcoming shiurim and webinars' },
    { key: 'dailyWisdom', label: 'Daily Wisdom', description: 'Morning Torah inspiration' }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Bell className="w-5 h-5 text-blue-600" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notif, idx) => (
          <div
            key={notif.key}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200"
          >
            <div className="flex-1">
              <div className="font-bold text-slate-900 text-sm">{notif.label}</div>
              <div className="text-xs text-slate-600">{notif.description}</div>
            </div>
            <Switch
              checked={settings[notif.key]}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, [notif.key]: checked })
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}