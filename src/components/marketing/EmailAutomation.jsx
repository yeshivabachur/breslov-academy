import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, Users, Zap, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmailAutomation({ onCreateSequence }) {
  const [sequence, setSequence] = useState({
    name: '',
    trigger: 'enrollment',
    emails: []
  });

  const triggers = [
    { id: 'enrollment', name: 'Course Enrollment', icon: Users },
    { id: 'completion', name: 'Lesson Completion', icon: Zap },
    { id: 'inactivity', name: '7 Days Inactive', icon: Clock }
  ];

  const addEmail = () => {
    setSequence({
      ...sequence,
      emails: [...sequence.emails, {
        id: Date.now(),
        subject: '',
        body: '',
        delay_days: sequence.emails.length
      }]
    });
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="font-serif flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          Email Automation Sequences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 font-serif">
            Sequence Name
          </label>
          <Input
            value={sequence.name}
            onChange={(e) => setSequence({ ...sequence, name: e.target.value })}
            placeholder="e.g., Welcome Series, Re-engagement Campaign"
            className="rounded-xl font-serif"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 font-serif">
            Trigger Event
          </label>
          <div className="grid grid-cols-3 gap-3">
            {triggers.map(trigger => {
              const Icon = trigger.icon;
              return (
                <button
                  key={trigger.id}
                  onClick={() => setSequence({ ...sequence, trigger: trigger.id })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    sequence.trigger === trigger.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-bold text-slate-900 font-serif">{trigger.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Email Sequence */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 font-serif">Email Sequence</h4>
            <Button
              onClick={addEmail}
              size="sm"
              variant="outline"
              className="rounded-xl font-serif"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Email
            </Button>
          </div>

          {sequence.emails.map((email, idx) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white rounded-xl border-2 border-slate-200 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-800">
                  Day {email.delay_days}
                </Badge>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <Input
                  value={email.subject}
                  onChange={(e) => {
                    const emails = [...sequence.emails];
                    emails[idx].subject = e.target.value;
                    setSequence({ ...sequence, emails });
                  }}
                  placeholder="Email subject..."
                  className="flex-1 font-serif"
                />
              </div>
              
              <Textarea
                value={email.body}
                onChange={(e) => {
                  const emails = [...sequence.emails];
                  emails[idx].body = e.target.value;
                  setSequence({ ...sequence, emails });
                }}
                placeholder="Email content..."
                className="min-h-[100px] font-serif"
              />
            </motion.div>
          ))}
        </div>

        <Button
          onClick={() => onCreateSequence?.(sequence)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-6 rounded-2xl font-serif"
        >
          <Zap className="w-5 h-5 mr-2" />
          Activate Sequence
        </Button>
      </CardContent>
    </Card>
  );
}