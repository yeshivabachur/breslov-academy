import React, { useState } from 'react';
import PageShell from '@/components/ui/PageShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DollarSign, Copy, Users, TrendingUp, CheckCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const REFERRALS = [
  { id: 1, user: 'david@example.com', date: '2026-01-10', status: 'Converted', commission: 36.00 },
  { id: 2, user: 'sarah@example.com', date: '2026-01-11', status: 'Pending', commission: 0 },
  { id: 3, user: 'moshe@example.com', date: '2026-01-12', status: 'Converted', commission: 36.00 },
];

export default function AffiliateProgram() {
  const [copied, setCopied] = useState(false);
  const refLink = 'https://breslov.academy/join?ref=gav4y';

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success('Affiliate link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell title="Affiliate Program" subtitle="Earn 20% recurring commission">
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-green-50 border-green-100">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-700">Total Earnings</p>
                <h3 className="text-3xl font-bold text-green-900">$72.00</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="mt-4 text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Referrals</p>
                <h3 className="text-3xl font-bold text-slate-900">3</h3>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg">
                <Users className="h-6 w-6 text-slate-600" />
              </div>
            </div>
            <div className="mt-4 w-full">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Next Payout ($100 min)</span>
                <span>72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Clicks</p>
                <h3 className="text-3xl font-bold text-slate-900">142</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              Conversion Rate: 2.1%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link Sharing */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to track referrals automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={refLink} readOnly className="bg-slate-50 font-mono" />
            <Button onClick={copyLink} className={copied ? 'bg-green-600' : ''}>
              {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Tabs */}
      <Tabs defaultValue="referrals" className="w-full">
        <TabsList>
          <TabsTrigger value="referrals">Referral History</TabsTrigger>
          <TabsTrigger value="assets">Marketing Assets</TabsTrigger>
          <TabsTrigger value="payouts">Payout Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {REFERRALS.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">{ref.user}</td>
                      <td className="px-6 py-4">{ref.date}</td>
                      <td className="px-6 py-4">
                        <Badge variant={ref.status === 'Converted' ? 'default' : 'secondary'}>
                          {ref.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {ref.commission > 0 ? `$${ref.commission.toFixed(2)}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card>
            <CardContent className="pt-6 text-center text-slate-500 py-12">
              <p>Banners and social media kits coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payouts">
          <Card>
            <CardContent className="pt-6 text-center text-slate-500 py-12">
              <p>Connect Stripe or PayPal to receive payouts.</p>
              <Button variant="outline" className="mt-4">Connect Payout Method</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}