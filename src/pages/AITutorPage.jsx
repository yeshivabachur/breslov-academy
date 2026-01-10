import React from 'react';
import PageShell from '@/components/ui/PageShell';
import AITutorInterface from '@/components/ai/AITutorInterface';
import { useSession } from '@/components/hooks/useSession';

export default function AITutorPage() {
  const { user } = useSession();

  return (
    <PageShell 
      title="AI Study Partner" 
      subtitle="Your personal chavruta for deep learning and exploration."
    >
      <div className="flex justify-center items-center py-8">
        <AITutorInterface 
          context={{ userName: user?.full_name }} 
          className="h-[700px] max-w-2xl shadow-2xl" 
        />
      </div>
    </PageShell>
  );
}
