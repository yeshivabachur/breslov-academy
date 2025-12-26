import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KnowledgeGraph({ concepts, userProgress }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!canvasRef.current || !concepts) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Node positions (circular layout for Sedarim)
    const centerX = width / 4;
    const centerY = height / 4;
    const radius = Math.min(width, height) / 5;

    const nodes = concepts.map((concept, idx) => {
      const angle = (idx / concepts.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...concept,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        completed: userProgress?.includes(concept.id)
      };
    });

    // Clear canvas
    ctx.clearRect(0, 0, width / 2, height / 2);

    // Draw connections
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    concepts.forEach((concept, idx) => {
      concept.prerequisites?.forEach(preId => {
        const targetIdx = concepts.findIndex(c => c.id === preId);
        if (targetIdx !== -1) {
          ctx.beginPath();
          ctx.moveTo(nodes[idx].x, nodes[idx].y);
          ctx.lineTo(nodes[targetIdx].x, nodes[targetIdx].y);
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    nodes.forEach(node => {
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
      
      if (node.completed) {
        ctx.fillStyle = '#10b981';
      } else if (node.available) {
        ctx.fillStyle = '#3b82f6';
      } else {
        ctx.fillStyle = '#94a3b8';
      }
      
      ctx.fill();
      
      // White border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(node.name.substring(0, 8), node.x, node.y + 4);
    });

  }, [concepts, userProgress, zoom]);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-serif">
            <Network className="w-5 h-5 text-blue-600" />
            Knowledge Graph - Your Learning Seder
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(zoom + 0.2)}
              className="rounded-lg"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
              className="rounded-lg"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative bg-slate-50 rounded-xl overflow-hidden" style={{ height: '500px' }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            <span className="text-sm text-slate-600 font-serif">Mastered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
            <span className="text-sm text-slate-600 font-serif">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-400 rounded-full border-2 border-white" />
            <span className="text-sm text-slate-600 font-serif">Locked</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}