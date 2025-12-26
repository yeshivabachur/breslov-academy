import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { User, Bell, Lock, Globe, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    studyReminders: true,
    language: 'english',
    theme: 'light'
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const saveSettings = async () => {
    await base44.auth.updateMe({ preferences: settings });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600" dir="rtl">הגדרות</p>
      </div>

      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <User className="w-5 h-5 text-blue-600" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
            <Input
              value={user?.full_name || ''}
              readOnly
              className="rounded-xl bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <Input
              value={user?.email || ''}
              readOnly
              className="rounded-xl bg-slate-50"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Bell className="w-5 h-5 text-purple-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications' },
            { key: 'pushNotifications', label: 'Push Notifications' },
            { key: 'weeklyReport', label: 'Weekly Progress Report' },
            { key: 'studyReminders', label: 'Study Reminders' }
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200"
            >
              <span className="text-sm font-semibold text-slate-900">{setting.label}</span>
              <Switch
                checked={settings[setting.key]}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, [setting.key]: checked })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        onClick={saveSettings}
        size="lg"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl"
      >
        Save Changes
      </Button>
    </div>
  );
}