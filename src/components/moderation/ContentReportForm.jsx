import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContentReportForm({ contentId, contentType }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const reasons = [
    'Inappropriate content',
    'Spam or misleading',
    'Harassment',
    'Incorrect information',
    'Other'
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <AlertCircle className="w-5 h-5 text-red-600" />
          Report Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Reason</label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select reason..." />
            </SelectTrigger>
            <SelectContent>
              {reasons.map((r, idx) => (
                <SelectItem key={idx} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Additional Details</label>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide more context..."
            className="min-h-[100px] rounded-xl"
          />
        </div>

        <Button
          disabled={!reason}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Report
        </Button>
      </CardContent>
    </Card>
  );
}