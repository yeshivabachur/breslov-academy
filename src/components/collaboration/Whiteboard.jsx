import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Eraser, Trash2, Download, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Whiteboard({ isShared = false }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = ['#000000', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Pencil className="w-5 h-5 text-blue-600" />
            Collaborative Whiteboard
          </div>
          {isShared && (
            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Shared
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => setTool('pen')}
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            className="rounded-lg"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setTool('eraser')}
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            className="rounded-lg"
          >
            <Eraser className="w-4 h-4" />
          </Button>
          
          <div className="h-8 w-px bg-slate-300 mx-2" />
          
          {colors.map((c, idx) => (
            <button
              key={idx}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-lg border-2 ${
                color === c ? 'border-slate-900 scale-110' : 'border-slate-200'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}

          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full border-2 border-slate-300 rounded-xl bg-white cursor-crosshair"
        />
      </CardContent>
    </Card>
  );
}