import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SearchHistory() {
  const [history, setHistory] = useState([
    { term: 'Azamra teaching', time: new Date(Date.now() - 3600000), results: 12 },
    { term: 'Likutey Moharan Torah 1', time: new Date(Date.now() - 7200000), results: 8 },
    { term: 'Hebrew vocabulary', time: new Date(Date.now() - 86400000), results: 156 }
  ]);

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            <h3 className="font-bold text-slate-900">Recent Searches</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-xs"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>

        <div className="space-y-2">
          {history.map((item, idx) => (
            <button
              key={idx}
              className="w-full p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{item.term}</div>
                  <div className="text-xs text-slate-500">
                    {item.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.results}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}