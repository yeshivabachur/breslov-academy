import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function StripeConnectPanel({ schoolId }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['stripe-connect-status', schoolId],
    queryFn: () => base44.request('/stripe/status', {
      params: { school_id: schoolId },
    }),
    enabled: !!schoolId,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.request('/stripe/connect', {
        method: 'POST',
        body: { school_id: schoolId },
      });
      return response;
    },
    onSuccess: (result) => {
      if (result?.url) {
        window.location.assign(result.url);
      } else {
        toast.error('Stripe onboarding link unavailable');
      }
    },
    onError: () => {
      toast.error('Unable to start Stripe onboarding');
    },
  });

  if (!schoolId) return null;

  const connected = Boolean(data?.connected);
  const statusLabel = connected ? 'Connected' : 'Not connected';
  const statusVariant = connected ? 'default' : 'secondary';

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Stripe Connect</CardTitle>
          <CardDescription>Accept payments and route payouts directly to your school.</CardDescription>
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Checking Stripe connection...</p>
        ) : connected ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>Charges enabled: {data?.charges_enabled ? 'Yes' : 'No'}</div>
            <div>Payouts enabled: {data?.payouts_enabled ? 'Yes' : 'No'}</div>
            <div>Details submitted: {data?.details_submitted ? 'Yes' : 'No'}</div>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh status
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Connect your Stripe account to enable payouts and automatic fee routing.
            </p>
            <Button onClick={() => connectMutation.mutate()} disabled={connectMutation.isPending}>
              {connectMutation.isPending ? 'Launching Stripe...' : 'Connect Stripe'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
