import React, { useState, useEffect } from 'react';
import PageShell from '@/components/ui/PageShell';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Loader2 } from 'lucide-react';
import { db } from '@/lib/db';
import { toast } from 'sonner';
import ForumBoard from '@/components/community/ForumBoard';

export default function Forums() {
  const [topics, setTopics] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', category: 'General', content: '' });

  // Load topics
  const refreshTopics = () => {
    setTopics([...db.getTopics()]); // copy to trigger re-render
  };

  useEffect(() => {
    refreshTopics();
  }, []);

  const handleCreate = () => {
    if (!newTopic.title) return;
    
    db.addTopic({
      ...newTopic,
      author: 'You', // current user
    });
    
    setIsDialogOpen(false);
    setNewTopic({ title: '', category: 'General', content: '' });
    refreshTopics();
    toast.success("Topic posted!");
  };

  return (
    <PageShell 
      title="Community Forums" 
      subtitle="Discuss, ask, and grow together"
      actions={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a Discussion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={newTopic.title} 
                  onChange={e => setNewTopic({...newTopic, title: e.target.value})}
                  placeholder="What's on your mind?"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={newTopic.category} 
                  onValueChange={v => setNewTopic({...newTopic, category: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Torah">Torah Study</SelectItem>
                    <SelectItem value="Advice">Advice & Support</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea 
                  value={newTopic.content} 
                  onChange={e => setNewTopic({...newTopic, content: e.target.value})}
                  placeholder="Elaborate..."
                />
              </div>
              <Button onClick={handleCreate} className="w-full">Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search discussions..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Topics</TabsTrigger>
          <TabsTrigger value="torah">Torah Study</TabsTrigger>
          <TabsTrigger value="advice">Advice & Support</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ForumBoard topics={topics} />
        </TabsContent>
        <TabsContent value="torah">
          <ForumBoard topics={topics.filter(t => t.category === 'Torah')} />
        </TabsContent>
        <TabsContent value="advice">
          <ForumBoard topics={topics.filter(t => t.category === 'Advice')} />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
