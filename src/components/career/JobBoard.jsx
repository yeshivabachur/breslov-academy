import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobBoard({ jobs, onApply }) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-black text-slate-900 mb-6">Torah Education Careers</h2>
      {jobs?.map((job, idx) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-slate-900">{job.title}</h3>
                      <div className="text-sm text-slate-600">{job.organization}</div>
                    </div>
                  </div>

                  <p className="text-slate-700 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary_range}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.employment_type}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.required_skills?.slice(0, 4).map((skill, i) => (
                      <Badge key={i} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => onApply?.(job.id)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl"
                >
                  Apply Now
                </Button>
                {job.application_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(job.application_url, '_blank')}
                    className="rounded-xl"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}