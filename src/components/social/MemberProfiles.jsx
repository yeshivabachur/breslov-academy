import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function MemberProfiles({ members = [] }) {
  const sampleMembers = [
    { name: 'Moshe L.', level: 'Scholar', xp: 2450, courses: 5, avatar: '👨‍🎓' },
    { name: 'David K.', level: 'Student', xp: 1230, courses: 3, avatar: '👨‍💼' },
    { name: 'Sarah M.', level: 'Sage', xp: 3890, courses: 8, avatar: '👩‍🏫' }
  ];

  const activeMembers = members.length > 0 ? members : sampleMembers;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Users className="w-5 h-5 text-blue-600" />
          Community Members
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeMembers.map((member, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{member.avatar}</div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">{member.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    {member.level}
                  </Badge>
                  <span className="text-xs text-slate-600">{member.xp} XP</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}