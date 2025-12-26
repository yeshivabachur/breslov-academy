import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Mail } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

export default function ShareButton({ title, url }) {
  const shareOptions = [
    { icon: Copy, label: 'Copy Link', action: () => {
      navigator.clipboard.writeText(url || window.location.href);
      toast.success('Link copied!');
    }},
    { icon: Mail, label: 'Email', action: () => {
      window.location.href = `mailto:?subject=${title}&body=${url}`;
    }}
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="space-y-2">
          {shareOptions.map((option, idx) => {
            const Icon = option.icon;
            return (
              <button
                key={idx}
                onClick={option.action}
                className="w-full p-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-sm"
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}