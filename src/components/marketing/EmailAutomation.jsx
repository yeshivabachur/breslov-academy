import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function EmailAutomation() {
  const campaigns = [
    {
      name: 'Welcome Series',
      trigger: 'On enrollment',
      emails: 3,
      sent: 145,
      openRate: 68,
      status: 'active'
    },
    {
      name: 'Re-engagement',
      trigger: '7 days inactive',
      emails: 2,
      sent: 23,
      openRate: 52,
      status: 'active'
    },
    {
      name: 'Course Completion',
      trigger: 'On course finish',
      emails: 1,
      sent: 67,
      openRate: 89,
      status: 'active'
    }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Mail className="w-5 h-5 text-blue-600" />
          Email Automation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {campaigns.map((campaign, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-xl border-2 border-slate-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-slate-900">{campaign.name}</div>
                <div className="text-xs text-slate-600">{campaign.trigger}</div>
              </div>
              <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}>
                {campaign.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <div className="font-bold text-slate-900">{campaign.sent}</div>
                <div className="text-xs text-slate-600">Sent</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">{campaign.openRate}%</div>
                <div className="text-xs text-slate-600">Opened</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">{campaign.emails}</div>
                <div className="text-xs text-slate-600">Emails</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}