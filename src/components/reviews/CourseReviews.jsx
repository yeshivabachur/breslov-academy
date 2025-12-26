import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function CourseReviews({ courseId }) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const reviews = [
    {
      author: 'Moshe L.',
      rating: 5,
      title: 'Life-changing teachings',
      content: 'This course on Azamra completely transformed my approach to life and relationships.',
      date: new Date('2024-12-01'),
      helpful: 12
    },
    {
      author: 'David K.',
      rating: 5,
      title: 'Clear and profound',
      content: 'Rabbi Cohen explains complex concepts in an accessible way. Highly recommend!',
      date: new Date('2024-12-10'),
      helpful: 8
    }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Star className="w-5 h-5 text-amber-600" />
            Reviews
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl"
          >
            Write Review
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => setRating(num)}
                  className="p-2"
                >
                  <Star className={`w-6 h-6 ${rating >= num ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              className="min-h-[100px] rounded-xl"
            />
            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl">
              Submit Review
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {reviews.map((rev, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-slate-900">{rev.author}</div>
                  <div className="flex gap-0.5 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {rev.date.toLocaleDateString()}
                </div>
              </div>
              <div className="font-bold text-slate-900 mb-1">{rev.title}</div>
              <p className="text-sm text-slate-700 mb-3">{rev.content}</p>
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <ThumbsUp className="w-3 h-3" />
                <span>{rev.helpful} found helpful</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}