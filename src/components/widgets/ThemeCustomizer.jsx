import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function ThemeCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState('default');

  const themes = [
    { id: 'default', name: 'Classic', primary: '#3b82f6', secondary: '#8b5cf6' },
    { id: 'warm', name: 'Warm Torah', primary: '#f59e0b', secondary: '#ef4444' },
    { id: 'forest', name: 'Forest Study', primary: '#10b981', secondary: '#059669' },
    { id: 'royal', name: 'Royal Purple', primary: '#8b5cf6', secondary: '#a855f7' },
    { id: 'ocean', name: 'Ocean Blue', primary: '#0ea5e9', secondary: '#06b6d4' }
  ];

  const applyTheme = (theme) => {
    setSelectedTheme(theme.id);
    // In production, apply CSS variables
    document.documentElement.style.setProperty('--primary', theme.primary);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <Palette className="w-4 h-4 mr-2" />
          Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <div className="font-bold text-slate-900">Choose Theme</div>
          <div className="grid gap-2">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme)}
                className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
                  selectedTheme === theme.id
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.primary }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.secondary }} />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{theme.name}</span>
                </div>
                {selectedTheme === theme.id && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}