import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Flag } from 'lucide-react';
import { toast } from 'sonner';
import { scopedCreate } from '@/components/api/scoped';

export default function ReportButton({ entityType, entityId, schoolId, user }) {
  const [showDialog, setShowDialog] = useState(false);

  const reportMutation = useMutation({
    mutationFn: (data) => scopedCreate('ContentReport', schoolId, data),
    onSuccess: () => {
      setShowDialog(false);
      toast.success('Report submitted. Our moderators will review it.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    reportMutation.mutate({
      school_id: schoolId,
      reporter_user: user.email,
      entity_type: entityType,
      entity_id: entityId,
      reason: formData.get('reason'),
      details: formData.get('details')
    });
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-slate-500">
          <Flag className="w-3 h-3 mr-1" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select name="reason" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPAM">Spam</SelectItem>
                <SelectItem value="HARASSMENT">Harassment</SelectItem>
                <SelectItem value="INAPPROPRIATE">Inappropriate Content</SelectItem>
                <SelectItem value="MISINFORMATION">Misinformation</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Additional Details</Label>
            <Textarea name="details" placeholder="Please provide more context..." rows={3} />
          </div>
          <Button type="submit" className="w-full" disabled={reportMutation.isPending}>
            Submit Report
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
