import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accessibility, Type, Contrast, MousePointer } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [largePointer, setLargePointer] = useState(false);

  const applyFontSize = (size) => {
    document.documentElement.style.fontSize = `${size}%`;
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 rounded-full w-12 h-12 p-0 shadow-xl"
        title="Accessibility Options"
      >
        <Accessibility className="w-5 h-5" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 left-4 z-50 w-80 glass-effect border-0 premium-shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-black text-slate-900 mb-4">Accessibility</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">Font Size</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{fontSize}%</span>
              </div>
              <Slider
                value={[fontSize]}
                onValueChange={(v) => {
                  setFontSize(v[0]);
                  applyFontSize(v[0]);
                }}
                min={80}
                max={150}
                step={10}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Contrast className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">High Contrast</span>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">Large Cursor</span>
              </div>
              <Switch
                checked={largePointer}
                onCheckedChange={setLargePointer}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}