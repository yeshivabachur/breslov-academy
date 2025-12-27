import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, Plus, Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function SchoolMonetization({ school }) {
  const [user, setUser] = useState(null);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const { data: offers = [] } = useQuery({
    queryKey: ['offers', school?.id],
    queryFn: () => base44.entities.Offer.filter({ school_id: school.id }),
    enabled: !!school
  });

  const { data: coupons = [] } = useQuery({
    queryKey: ['coupons', school?.id],
    queryFn: () => base44.entities.Coupon.filter({ school_id: school.id }),
    enabled: !!school
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['purchases', school?.id],
    queryFn: () => base44.entities.Purchase.filter({ school_id: school.id }, '-created_date', 50),
    enabled: !!school
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['school-courses', school?.id],
    queryFn: () => base44.entities.Course.filter({ school_id: school.id }),
    enabled: !!school
  });

  const createOfferMutation = useMutation({
    mutationFn: (data) => base44.entities.Offer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['offers']);
      setShowOfferDialog(false);
      setEditingOffer(null);
      toast.success('Offer created!');
    }
  });

  const updateOfferMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Offer.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['offers']);
      toast.success('Offer updated!');
    }
  });

  const createCouponMutation = useMutation({
    mutationFn: (data) => base44.entities.Coupon.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['coupons']);
      setShowCouponDialog(false);
      toast.success('Coupon created!');
    }
  });

  const markPurchasePaidMutation = useMutation({
    mutationFn: async ({ purchaseId, purchase }) => {
      // Mark purchase as paid
      await base44.entities.Purchase.update(purchaseId, { status: 'paid' });
      
      // Create entitlements
      const offer = offers.find(o => o.id === purchase.offer_id);
      if (!offer) return;

      const startsAt = new Date().toISOString();
      
      if (offer.access_scope === 'ALL_COURSES') {
        await base44.entities.Entitlement.create({
          school_id: school.id,
          user_email: purchase.user_email,
          type: 'ALL_COURSES',
          source: 'PURCHASE',
          source_id: purchaseId,
          starts_at: startsAt
        });
      } else if (offer.access_scope === 'SELECTED_COURSES') {
        const offerCourses = await base44.entities.OfferCourse.filter({ offer_id: offer.id });
        for (const oc of offerCourses) {
          await base44.entities.Entitlement.create({
            school_id: school.id,
            user_email: purchase.user_email,
            type: 'COURSE',
            course_id: oc.course_id,
            source: 'PURCHASE',
            source_id: purchaseId,
            starts_at: startsAt
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['purchases']);
      toast.success('Purchase marked as paid and entitlements created!');
    }
  });

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const offerData = {
      school_id: school.id,
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      price_cents: parseFloat(formData.get('price')) * 100,
      currency: 'USD',
      billing_interval: formData.get('billing_interval') || null,
      status: 'active',
      access_scope: formData.get('access_scope')
    };

    if (editingOffer) {
      updateOfferMutation.mutate({ id: editingOffer.id, data: offerData });
    } else {
      createOfferMutation.mutate(offerData);
    }
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    createCouponMutation.mutate({
      school_id: school.id,
      code: formData.get('code').toUpperCase(),
      discount_type: formData.get('discount_type'),
      discount_value: parseFloat(formData.get('discount_value')),
      max_uses: parseInt(formData.get('max_uses')),
      expires_at: formData.get('expires_at'),
      is_active: true,
      created_by: user.email
    });
  };

  return (
    <div className="space-y-6">
      {/* Offers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Offers & Pricing</CardTitle>
          <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingOffer(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleOfferSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Offer Type</Label>
                  <Select name="type" defaultValue={editingOffer?.type || 'ONE_TIME'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_TIME">One-Time Purchase</SelectItem>
                      <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={editingOffer?.name} required />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" defaultValue={editingOffer?.description} rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (USD)</Label>
                    <Input name="price" type="number" step="0.01" defaultValue={editingOffer?.price_cents ? editingOffer.price_cents / 100 : ''} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Billing Interval (for subscriptions)</Label>
                    <Select name="billing_interval" defaultValue={editingOffer?.billing_interval || 'month'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Access Scope</Label>
                  <Select name="access_scope" defaultValue={editingOffer?.access_scope || 'ALL_COURSES'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_COURSES">All Courses</SelectItem>
                      <SelectItem value="SELECTED_COURSES">Selected Courses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {offers.map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="font-semibold">{offer.name}</h4>
                    <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                      {offer.status}
                    </Badge>
                    <Badge variant="outline">{offer.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{offer.description}</p>
                  <p className="text-sm text-slate-900 font-bold mt-1">
                    ${(offer.price_cents / 100).toFixed(2)} {offer.billing_interval && `/ ${offer.billing_interval}`}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingOffer(offer);
                  setShowOfferDialog(true);
                }}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {offers.length === 0 && (
              <p className="text-center text-slate-500 py-8">No offers yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Coupons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Coupons</CardTitle>
          <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Coupon</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCouponSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Coupon Code</Label>
                  <Input name="code" placeholder="SAVE20" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <Select name="discount_type" defaultValue="percentage">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input name="discount_value" type="number" step="0.01" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Max Uses</Label>
                  <Input name="max_uses" type="number" defaultValue="100" />
                </div>

                <div className="space-y-2">
                  <Label>Expires At</Label>
                  <Input name="expires_at" type="date" />
                </div>

                <Button type="submit" className="w-full">Create Coupon</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <span className="font-mono font-bold">{coupon.code}</span>
                  <span className="text-sm text-slate-600 ml-3">
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` : `$${coupon.discount_value} off`}
                  </span>
                </div>
                <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                  {coupon.current_uses || 0} / {coupon.max_uses || '∞'}
                </Badge>
              </div>
            ))}
            {coupons.length === 0 && (
              <p className="text-center text-slate-500 py-8">No coupons yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Purchases */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Purchases (Manual Provider)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {purchases.filter(p => p.provider === 'MANUAL').map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-semibold">{purchase.user_email}</p>
                  <p className="text-sm text-slate-600">
                    ${(purchase.amount_cents / 100).toFixed(2)} • {offers.find(o => o.id === purchase.offer_id)?.name}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={purchase.status === 'paid' ? 'default' : 'secondary'}>
                    {purchase.status}
                  </Badge>
                  {purchase.status === 'pending' && (
                    <Button size="sm" onClick={() => markPurchasePaidMutation.mutate({ purchaseId: purchase.id, purchase })}>
                      <Check className="w-4 h-4 mr-1" />
                      Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {purchases.filter(p => p.provider === 'MANUAL').length === 0 && (
              <p className="text-center text-slate-500 py-8">No manual purchases yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}