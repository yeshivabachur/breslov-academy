import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function PeerReview({ assignment }) {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const submission = {
    student: 'David L.',
    title: 'Essay on Azamra Concept',
    submitted: new Date(),
    content: 'The teaching of Azamra encourages us to find the good point in everyone...'
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Users className="w-5 h-5 text-blue-600" />
          Peer Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="font-bold text-slate-900 mb-1">{submission.student}</div>
          <div className="text-sm text-slate-600 mb-2">{submission.title}</div>
          <p className="text-sm text-slate-700 line-clamp-3">{submission.content}</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => setRating(num)}
                className="w-12 h-12"
              >
                <Star className={`w-8 h-8 ${rating >= num ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Feedback</label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide constructive feedback..."
            className="min-h-[120px] rounded-xl"
          />
        </div>

        <Button
          disabled={!rating || !feedback}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Review
        </Button>
      </CardContent>
    </Card>
  );
}