import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Check } from 'lucide-react';
import { toast } from 'sonner';
import { buildCacheKey, scopedCreate, scopedFilter, scopedUpdate } from '@/components/api/scoped';
import StripeConnectPanel from '@/components/billing/StripeConnectPanel';

export default function SchoolPayouts({ school, user }) {
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();
  const payoutFields = [
    'id',
    'instructor_email',
    'amount_cents',
    'period_start',
    'period_end',
    'status'
  ];

  const { data: payouts = [] } = useQuery({
    queryKey: buildCacheKey('all-payouts', school?.id),
    queryFn: () => scopedFilter(
      'InstructorPayout',
      school.id,
      {},
      '-created_date',
      200,
      { fields: payoutFields }
    ),
    enabled: !!school
  });

  const createPayoutMutation = useMutation({
    mutationFn: async (data) => {
      const payout = await scopedCreate('InstructorPayout', school.id, data);
      try {
        await scopedCreate('AuditLog', school.id, {
          school_id: school.id,
          user_email: user?.email,
          action: 'PAYOUT_CREATED',
          entity_type: 'InstructorPayout',
          entity_id: payout.id,
          metadata: { amount_cents: payout.amount_cents }
        });
      } catch (error) {
        // Best effort audit
      }
      return payout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('all-payouts', school?.id));
      setShowDialog(false);
      toast.success('Payout created');
    }
  });

  const markPaidMutation = useMutation({
    mutationFn: async (id) => {
      const payout = await scopedUpdate('InstructorPayout', id, {
        status: 'PAID',
        paid_at: new Date().toISOString()
      }, school.id, true);
      try {
        await scopedCreate('AuditLog', school.id, {
          school_id: school.id,
          user_email: user?.email,
          action: 'PAYOUT_MARKED_PAID',
          entity_type: 'InstructorPayout',
          entity_id: id
        });
      } catch (error) {
        // Best effort audit
      }
      return payout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('all-payouts', school?.id));
      toast.success('Payout marked as paid');
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    createPayoutMutation.mutate({
      school_id: school.id,
      instructor_email: formData.get('instructor_email'),
      amount_cents: Math.round(parseFloat(formData.get('amount')) * 100),
      period_start: formData.get('period_start'),
      period_end: formData.get('period_end'),
      notes: formData.get('notes'),
      created_by_user: user.email
    });
  };

  return (
    <div className="space-y-6">
      <StripeConnectPanel schoolId={school?.id} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Instructor Payouts
          </CardTitle>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button>Create Payout</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Instructor Payout</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Instructor Email</Label>
                  <Input name="instructor_email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input name="amount" type="number" step="0.01" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Period Start</Label>
                    <Input name="period_start" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Period End</Label>
                    <Input name="period_end" type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input name="notes" placeholder="Optional notes" />
                </div>
                <Button type="submit" className="w-full">Create Payout</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Instructor</th>
                  <th className="text-left py-3 px-4">Period</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4">{payout.instructor_email}</td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(payout.period_start).toLocaleDateString()} -{' '}
                      {new Date(payout.period_end).toLocaleDateString()}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      ${(payout.amount_cents / 100).toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4">
                      <Badge variant={payout.status === 'PAID' ? 'default' : 'secondary'}>
                        {payout.status}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4">
                      {payout.status === 'PENDING' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markPaidMutation.mutate(payout.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payouts.length === 0 && (
              <p className="text-slate-500 text-center py-8">No payouts yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
