import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TestimonialCard({ testimonial }) {
  const sample = testimonial || {
    name: 'David Cohen',
    role: 'Torah Student',
    course: 'Likutey Moharan Mastery',
    rating: 5,
    text: 'This platform transformed my Torah learning. The AI tutor and spaced repetition made mastering Hebrew effortless.',
    image: null
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-8 space-y-4">
        <Quote className="w-10 h-10 text-amber-600 opacity-50" />
        
        <div className="flex gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < sample.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
          ))}
        </div>

        <p className="text-lg text-slate-700 leading-relaxed font-serif">
          "{sample.text}"
        </p>

        <div className="pt-4 border-t border-slate-200">
          <div className="font-bold text-slate-900">{sample.name}</div>
          <div className="text-sm text-slate-600">{sample.role}</div>
          <Badge variant="outline" className="text-xs mt-2">
            {sample.course}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}