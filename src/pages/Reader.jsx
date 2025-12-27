import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Highlighter, StickyNote, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Reader() {
  const [user, setUser] = useState(null);
  const [activeSchoolId, setActiveSchoolId] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [showHighlightDialog, setShowHighlightDialog] = useState(false);
  const [highlightNote, setHighlightNote] = useState('');
  const [showExplainDialog, setShowExplainDialog] = useState(false);
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const textId = urlParams.get('id');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        const schoolId = localStorage.getItem('active_school_id');
        setActiveSchoolId(schoolId);
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: text } = useQuery({
    queryKey: ['text', textId],
    queryFn: async () => {
      const texts = await base44.entities.Text.filter({ text_id: textId });
      return texts[0];
    },
    enabled: !!textId
  });

  const { data: highlights = [] } = useQuery({
    queryKey: ['highlights', textId, user?.email],
    queryFn: () => base44.entities.Highlight.filter({
      text_id: textId,
      user_email: user.email
    }),
    enabled: !!textId && !!user
  });

  const createHighlightMutation = useMutation({
    mutationFn: (data) => base44.entities.Highlight.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['highlights']);
      setShowHighlightDialog(false);
      setHighlightNote('');
      toast.success('Highlight saved!');
    }
  });

  const requestExplanationMutation = useMutation({
    mutationFn: (data) => base44.entities.ExplanationRequest.create(data),
    onSuccess: () => {
      setShowExplainDialog(false);
      toast.success('Explanation request saved! Coming soon...');
    }
  });

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedStr = selection.toString().trim();
    
    if (selectedStr.length > 0) {
      setSelectedText({
        text: selectedStr,
        start: 0, // Simplified - in production would calculate actual indices
        end: selectedStr.length
      });
    }
  };

  const handleHighlight = () => {
    if (!selectedText) return;
    
    createHighlightMutation.mutate({
      school_id: activeSchoolId,
      user_email: user.email,
      text_id: textId,
      start_idx: selectedText.start,
      end_idx: selectedText.end,
      color: 'yellow',
      note: highlightNote,
      visibility: 'PRIVATE'
    });
  };

  const handleExplain = () => {
    if (!selectedText) return;
    
    requestExplanationMutation.mutate({
      school_id: activeSchoolId,
      user_email: user.email,
      text_id: textId,
      excerpt: selectedText.text
    });
  };

  if (!text) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4 animate-pulse" />
        <p className="text-slate-600">Loading text...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-xl p-8 shadow-2xl">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="w-6 h-6 text-amber-300" />
          <p className="text-amber-300 text-sm font-medium">{text.category || 'Sacred Text'}</p>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">{text.title}</h1>
        {text.source_ref && (
          <p className="text-amber-200">{text.source_ref}</p>
        )}
      </div>

      {/* Selection Actions */}
      {selectedText && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 rounded-lg shadow-2xl p-4 flex items-center space-x-2 z-50">
          <Button size="sm" onClick={() => setShowHighlightDialog(true)}>
            <Highlighter className="w-4 h-4 mr-2" />
            Highlight
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowExplainDialog(true)}>
            <Sparkles className="w-4 h-4 mr-2" />
            Explain
          </Button>
        </div>
      )}

      {/* Split View */}
      <Tabs defaultValue="split" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="split">Split View</TabsTrigger>
          <TabsTrigger value="english">English Only</TabsTrigger>
          <TabsTrigger value="hebrew">Hebrew Only</TabsTrigger>
        </TabsList>

        <TabsContent value="split">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English */}
            <Card>
              <CardHeader>
                <CardTitle>English</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  onMouseUp={handleTextSelection}
                  className="prose prose-slate max-w-none leading-loose text-lg"
                >
                  {text.english || 'No English translation available'}
                </div>
              </CardContent>
            </Card>

            {/* Hebrew */}
            <Card>
              <CardHeader>
                <CardTitle>עברית</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  onMouseUp={handleTextSelection}
                  className="prose prose-slate max-w-none leading-loose text-lg text-right"
                  dir="rtl"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif" }}
                >
                  {text.hebrew || 'אין תרגום עברי זמין'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="english">
          <Card>
            <CardContent className="p-8">
              <div 
                onMouseUp={handleTextSelection}
                className="prose prose-slate prose-lg max-w-none"
              >
                {text.english || 'No English translation available'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hebrew">
          <Card>
            <CardContent className="p-8">
              <div 
                onMouseUp={handleTextSelection}
                className="prose prose-slate prose-lg max-w-none text-right"
                dir="rtl"
                style={{ fontFamily: "'Frank Ruhl Libre', serif" }}
              >
                {text.hebrew || 'אין תרגום עברי זמין'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Highlights Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <StickyNote className="w-5 h-5 mr-2" />
            My Highlights & Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {highlights.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No highlights yet</p>
          ) : (
            <div className="space-y-3">
              {highlights.map((highlight) => (
                <div key={highlight.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-slate-900">{highlight.note || 'Highlighted'}</p>
                  <Badge variant="outline" className="mt-2">
                    {highlight.visibility}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={showHighlightDialog} onOpenChange={setShowHighlightDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Highlight</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded border border-amber-200">
              <p className="text-sm text-slate-700">{selectedText?.text}</p>
            </div>
            <Textarea
              value={highlightNote}
              onChange={(e) => setHighlightNote(e.target.value)}
              placeholder="Add a note (optional)"
              rows={3}
            />
            <Button onClick={handleHighlight} className="w-full">
              Save Highlight
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showExplainDialog} onOpenChange={setShowExplainDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Explain This Text</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded border">
              <p className="text-sm text-slate-700">{selectedText?.text}</p>
            </div>
            <p className="text-sm text-slate-600">
              AI explanations are coming soon! We've saved your request.
            </p>
            <Button onClick={handleExplain} className="w-full">
              Save Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}