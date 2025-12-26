import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import JobBoard from '../components/career/JobBoard';

export default function Jobs() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: jobs = [] } = useQuery({
    queryKey: ['job-listings'],
    queryFn: () => base44.entities.JobListing.filter({ status: 'active' }, '-created_date')
  });

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900">Career Opportunities</h1>
              <p className="text-xl text-slate-600">Jewish education positions from our partner institutions</p>
            </div>
          </div>
        </motion.div>

        <JobBoard jobs={jobs} onApply={(jobId) => console.log('Apply to', jobId)} />
      </div>
    </div>
  );
}