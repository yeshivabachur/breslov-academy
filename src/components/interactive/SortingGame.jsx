import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';

export default function SortingGame({ items, onComplete }) {
  const defaultItems = [
    { id: 1, text: 'Creation', order: 1 },
    { id: 2, text: 'Exodus from Egypt', order: 2 },
    { id: 3, text: 'Giving of Torah', order: 3 },
    { id: 4, text: 'Entering Israel', order: 4 }
  ];

  const [sortedItems, setSortedItems] = useState(
    (items || defaultItems).sort(() => Math.random() - 0.5)
  );

  const moveUp = (index) => {
    if (index === 0) return;
    const newItems = [...sortedItems];
    [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    setSortedItems(newItems);
  };

  const moveDown = (index) => {
    if (index === sortedItems.length - 1) return;
    const newItems = [...sortedItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setSortedItems(newItems);
  };

  const checkOrder = () => {
    return sortedItems.every((item, idx) => item.order === idx + 1);
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <Badge className="bg-purple-100 text-purple-800">Sort in Order</Badge>

        <div className="space-y-2">
          {sortedItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-xl border-2 border-slate-200 flex items-center justify-between"
            >
              <span className="font-bold text-slate-900">{item.text}</span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="h-8 w-8 p-0"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveDown(idx)}
                  disabled={idx === sortedItems.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => {
            if (checkOrder()) {
              onComplete?.(true);
            }
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Submit Order
        </Button>
      </CardContent>
    </Card>
  );
}