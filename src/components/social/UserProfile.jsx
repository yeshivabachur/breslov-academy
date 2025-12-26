import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Award, BookOpen, MessageCircle, Star } from 'lucide-react';

export default function UserProfile({ user }) {
  const profile = user || {
    name: 'Moshe Cohen',
    level: 'Scholar',
    xp: 2450,
    lessonsCompleted: 45,
    coursesCompleted: 3,
    streak: 18,
    achievements: 12,
    bio: 'Dedicated Breslov student focusing on Likutey Moharan and Hebrew language',
    joinDate: new Date('2024-09-01')
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
            <User className="w-16 h-16 text-white" />
          </div>
          
          <div>
            <div className="text-3xl font-black text-slate-900 mb-2">{profile.name}</div>
            <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-1">
              {profile.level}
            </Badge>
          </div>

          <p className="text-slate-600 max-w-md mx-auto">{profile.bio}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <div className="text-3xl font-black text-blue-600">{profile.xp}</div>
            <div className="text-xs text-slate-600">Total XP</div>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <div className="text-3xl font-black text-green-600">{profile.lessonsCompleted}</div>
            <div className="text-xs text-slate-600">Lessons</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <div className="text-3xl font-black text-amber-600">{profile.achievements}</div>
            <div className="text-xs text-slate-600">Badges</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl">
            <Star className="w-4 h-4 mr-2" />
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}