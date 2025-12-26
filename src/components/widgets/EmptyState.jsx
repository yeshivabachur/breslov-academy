import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

export default function EmptyState({ icon: Icon = BookOpen, title, description, actionLabel, onAction }) {
  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-12 text-center">
        <Icon className="w-20 h-20 text-slate-300 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">{description}</p>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}