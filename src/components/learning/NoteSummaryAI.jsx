import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Download, Copy, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

export default function NoteSummaryAI({ notes, lessonContent }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a concise, well-structured summary of these Torah study notes:
        
        Lesson: ${lessonContent}
        Student Notes: ${notes}
        
        Format the summary with:
        1. Key concepts learned
        2. Personal insights
        3. Questions for further study
        4. Action items
        
        Keep it clear and Torah-focused.`
      });
      
      setSummary(response);
    } catch (error) {
      setSummary('Unable to generate summary at this time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-black text-slate-900">AI Summary</h3>
          </div>
          {summary && (
            <Badge className="bg-purple-100 text-purple-800">
              Ready
            </Badge>
          )}
        </div>

        {!summary ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 mb-1">Generate Smart Summary</div>
              <div className="text-sm text-slate-600">
                AI will analyze your notes and create a structured summary
              </div>
            </div>
            <Button
              onClick={generateSummary}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 prose prose-sm max-w-none">
              {summary}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(summary)}
                className="flex-1 rounded-lg"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={generateSummary}
                size="sm"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}