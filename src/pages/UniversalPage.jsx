import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageShell from '@/components/ui/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Filter, Download, Trash2 } from 'lucide-react';
import { ENTITY_REGISTRY, getEntityDefinition } from '@/components/api/entityRegistry';
import { db } from '@/lib/db';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function UniversalPage() {
  const { pageName } = useParams();
  
  // Normalize page name to entity key
  const entityKey = pageName ? pageName.replace(/-./g, x => x[1].toUpperCase()).replace(/^./, x => x.toUpperCase()) : 'Dashboard';
  const def = getEntityDefinition(entityKey);
  
  const [items, setItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const refresh = () => {
    setItems([...db.list(entityKey)]);
  };

  useEffect(() => {
    refresh();
    setFormData({}); // Reset form on page change
  }, [entityKey]);

  const handleCreate = () => {
    db.create(entityKey, formData);
    setIsDialogOpen(false);
    setFormData({});
    refresh();
    toast.success(`${def.label} created`);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure?')) {
      db.delete(entityKey, id);
      refresh();
      toast.success('Deleted');
    }
  };

  return (
    <PageShell title={def.label} subtitle={`Manage ${def.label}s`}>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder={`Search ${def.label}s...`} className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create {def.label}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New {def.label}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {def.fields.map(field => (
                  <div key={field} className="space-y-2">
                    <Label className="capitalize">{field}</Label>
                    <Input 
                      value={formData[field] || ''}
                      onChange={e => setFormData({...formData, [field]: e.target.value})}
                    />
                  </div>
                ))}
                <Button onClick={handleCreate} className="w-full">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Data Grid */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                {def.fields.map(f => (
                  <th key={f} className="px-6 py-3 font-medium capitalize">{f}</th>
                ))}
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.length === 0 && (
                <tr>
                  <td colSpan={def.fields.length + 2} className="px-6 py-8 text-center text-slate-500">
                    No items found. Create one to get started.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 group">
                  {def.fields.map(f => (
                    <td key={f} className="px-6 py-4">{item[f] || '-'}</td>
                  ))}
                  <td className="px-6 py-4 text-slate-500">
                    {format(item.created_at, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}