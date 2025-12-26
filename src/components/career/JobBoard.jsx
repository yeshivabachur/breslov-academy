import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function JobBoard() {
  const jobs = [
    {
      title: 'Hebrew Teacher',
      organization: 'Jewish Academy',
      location: 'Jerusalem, Israel',
      type: 'Full-time',
      posted: new Date(Date.now() - 86400000)
    },
    {
      title: 'Talmud Instructor',
      organization: 'Online Yeshiva',
      location: 'Remote',
      type: 'Part-time',
      posted: new Date(Date.now() - 172800000)
    }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <div>
            <div>Torah Teaching Jobs</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">משרות הוראה</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.map((job, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all"
          >
            <div className="font-bold text-slate-900 mb-2">{job.title}</div>
            <div className="text-sm text-slate-700 mb-3">{job.organization}</div>
            
            <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </div>
              <Badge variant="outline" className="text-xs">
                {job.type}
              </Badge>
            </div>

            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl"
            >
              View Details
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}