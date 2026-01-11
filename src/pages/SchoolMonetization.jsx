import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { createEntitlementsForPurchase, processReferral } from '@/components/utils/entitlements';
import ConversionFunnel from '@/components/analytics/ConversionFunnel';
import RevenueChart from '@/components/analytics/RevenueChart';
import PayoutBatchManager from '@/components/payouts/PayoutBatchManager';
import VirtualizedList from '@/components/system/VirtualizedList';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedCreate, scopedDelete, scopedFilter, scopedUpdate } from '@/components/api/scoped';
import PageShell from '@/components/ui/PageShell';

const OFFER_TYPES = [
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  { value: 'COURSE', label: 'Course' },
  { value: 'BUNDLE', label: 'Bundle' },
  { value: 'ADDON', label: 'Add-on' }
];

const ACCESS_SCOPES = [
  { value: 'ALL_COURSES', label: 'All courses' },
  { value: 'SELECTED_COURSES', label: 'Selected courses' }
];

const BILLING_INTERVALS = [
  { value: 'month', label: 'Monthly' },
  { value: 'year', label: 'Yearly' }
];

const DISCOUNT_TYPES = [
  { value: 'PERCENTAGE', label: 'Percentage' },
  { value: 'AMOUNT', label: 'Amount' }
];

const DEFAULT_OFFER_DRAFT = {
  name: '',
  description: '',
  offer_type: 'COURSE',
  price: '',
  billing_interval: 'month',
  access_scope: 'SELECTED_COURSES',
  is_active: true,
  course_ids: []
};

const DEFAULT_COUPON_DRAFT = {
  code: '',
  discount_type: 'PERCENTAGE',
  discount_value: '',
  usage_limit: '',
  expires_at: '',
  is_active: true
};

function normalizePriceToCents(value) {
  const parsed = Number(String(value || '').replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(parsed * 100);
}

function arrayEquals(a = [], b = []) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].map(String).sort();
  const sortedB = [...b].map(String).sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

function buildOfferDraft(offer, courseIds = []) {
  if (!offer) return { ...DEFAULT_OFFER_DRAFT };
  return {
    name: offer.name || '',
    description: offer.description || '',
    offer_type: offer.offer_type || 'COURSE',
    price: offer.price_cents ? (offer.price_cents / 100).toFixed(2) : '',
    billing_interval: offer.billing_interval || 'month',
    access_scope: offer.access_scope || 'SELECTED_COURSES',
    is_active: offer.is_active !== false,
    course_ids: courseIds
  };
}

function buildCouponDraft(coupon) {
  if (!coupon) return { ...DEFAULT_COUPON_DRAFT };
  return {
    code: coupon.code || '',
    discount_type: coupon.discount_type || 'PERCENTAGE',
    discount_value: coupon.discount_value ?? '',
    usage_limit: coupon.usage_limit ?? '',
    expires_at: coupon.expires_at ? String(coupon.expires_at).slice(0, 10) : '',
    is_active: coupon.is_active !== false
  };
}

function diffValues(current = {}, next = {}) {
  const changes = {};
  Object.keys(next).forEach((key) => {
    if (key === 'course_ids') {
      if (!arrayEquals(current.course_ids || [], next.course_ids || [])) {
        changes.course_ids = { from: current.course_ids || [], to: next.course_ids || [] };
      }
      return;
    }
    if (next[key] !== current[key]) {
      changes[key] = { from: current[key], to: next[key] };
    }
  });
  return changes;
}

export default function SchoolMonetization() {
  const { user, activeSchoolId, isAdmin, isLoading } = useSession();
  const queryClient = useQueryClient();
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [offerDraft, setOfferDraft] = useState({ ...DEFAULT_OFFER_DRAFT });
  const [couponDraft, setCouponDraft] = useState({ ...DEFAULT_COUPON_DRAFT });
  const [offerReason, setOfferReason] = useState('');
  const [couponReason, setCouponReason] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      try {
        base44.auth.redirectToLogin();
      } catch {}
    }
  }, [isLoading, user]);

  const { data: offers = [] } = useQuery({
    queryKey: buildCacheKey('offers', activeSchoolId),
    queryFn: () => scopedFilter('Offer', activeSchoolId, {}),
    enabled: !!activeSchoolId && isAdmin
  });

  const { data: coupons = [] } = useQuery({
    queryKey: buildCacheKey('coupons', activeSchoolId),
    queryFn: () => scopedFilter('Coupon', activeSchoolId, {}),
    enabled: !!activeSchoolId && isAdmin
  });

  const { data: transactions = [] } = useQuery({
    queryKey: buildCacheKey('transactions', activeSchoolId),
    queryFn: () => scopedFilter('Transaction', activeSchoolId, {}, '-created_date', 100),
    enabled: !!activeSchoolId && isAdmin
  });

  const { data: courses = [] } = useQuery({
    queryKey: buildCacheKey('courses', activeSchoolId),
    queryFn: () => scopedFilter('Course', activeSchoolId, {}, 'title', 200),
    enabled: !!activeSchoolId && isAdmin
  });

  const { data: offerCourses = [] } = useQuery({
    queryKey: buildCacheKey('offer-courses', activeSchoolId),
    queryFn: () => scopedFilter('OfferCourse', activeSchoolId, {}, null, 1000),
    enabled: !!activeSchoolId && isAdmin
  });

  const { data: pricingRequests = [] } = useQuery({
    queryKey: buildCacheKey('pricing-requests', activeSchoolId),
    queryFn: () => scopedFilter('PricingChangeRequest', activeSchoolId, {}, '-created_date', 200),
    enabled: !!activeSchoolId && isAdmin
  });

  const offerCoursesByOfferId = useMemo(() => {
    const map = new Map();
    (offerCourses || []).forEach((row) => {
      if (!row?.offer_id || !row?.course_id) return;
      const key = String(row.offer_id);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(String(row.course_id));
    });
    return map;
  }, [offerCourses]);

  const pendingRequests = useMemo(() => {
    return (pricingRequests || []).filter((req) => req?.status === 'PENDING');
  }, [pricingRequests]);

  const pendingByEntity = useMemo(() => {
    const map = new Map();
    pendingRequests.forEach((req) => {
      if (!req?.entity_type || !req?.entity_id) return;
      map.set(`${req.entity_type}:${req.entity_id}`, req);
    });
    return map;
  }, [pendingRequests]);

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (t.amount_cents || 0), 0);

  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  const approveMutation = useMutation({
    mutationFn: async (transactionId) => {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      const offer = offers.find(o => o.id === transaction.offer_id);

      // Update transaction
      await scopedUpdate('Transaction', transactionId, {
        status: 'completed'
      }, activeSchoolId, true);

      // Grant entitlements using helper (idempotent)
      if (offer) {
        const entResult = await createEntitlementsForPurchase(transaction, offer, activeSchoolId);

        // Process referral commission (idempotent)
        const refResult = await processReferral(transaction, activeSchoolId);

        // Record coupon redemption if applicable (idempotent)
        if (transaction.coupon_code) {
          const coupons = await scopedFilter('Coupon', activeSchoolId, {
            code: transaction.coupon_code
          });
          if (coupons[0]) {
            const { recordCouponRedemption } = await import('../components/utils/entitlements');
            await recordCouponRedemption({
              school_id: activeSchoolId,
              coupon: coupons[0],
              transaction,
              user_email: transaction.user_email
            });
          }
        }

        console.log('Approval result:', { entitlements: entResult, referral: refResult });
      }

      // Log event
      await scopedCreate('AuditLog', activeSchoolId, {
        school_id: activeSchoolId,
        user_email: user.email,
        action: 'APPROVE_TRANSACTION',
        entity_type: 'Transaction',
        entity_id: transactionId,
        metadata: {
          status: 'completed',
          amount_cents: transaction?.amount_cents || 0,
          offer_id: transaction?.offer_id || null,
          coupon_code: transaction?.coupon_code || null
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('transactions', activeSchoolId));
      toast.success('Transaction approved and access granted');
    }
  });

  const syncOfferCourses = async (offerId, courseIds = []) => {
    if (!offerId) return;
    const existing = await scopedFilter('OfferCourse', activeSchoolId, { offer_id: offerId }, null, 1000);
    const existingIds = new Set(existing.map((row) => String(row.course_id)));
    const desiredIds = new Set((courseIds || []).map((id) => String(id)));

    await Promise.all(
      existing
        .filter((row) => !desiredIds.has(String(row.course_id)))
        .map((row) => scopedDelete('OfferCourse', row.id, activeSchoolId, true))
    );

    for (const courseId of desiredIds) {
      if (existingIds.has(courseId)) continue;
      await scopedCreate('OfferCourse', activeSchoolId, {
        school_id: activeSchoolId,
        offer_id: offerId,
        course_id: courseId
      });
    }
  };

  const pricingRequestMutation = useMutation({
    mutationFn: async ({ entityType, entityId, action, proposed, current, reason }) => {
      const now = new Date().toISOString();
      const changes = action === 'CREATE' ? proposed : diffValues(current || {}, proposed || {});
      const request = await scopedCreate('PricingChangeRequest', activeSchoolId, {
        school_id: activeSchoolId,
        entity_type: entityType,
        entity_id: entityId || null,
        action,
        status: 'PENDING',
        requested_by: user?.email || null,
        requested_at: now,
        reason: reason || null,
        proposed,
        current: current || null,
        changes
      });

      await scopedCreate('AuditLog', activeSchoolId, {
        school_id: activeSchoolId,
        user_email: user?.email,
        action: 'PRICE_CHANGE_REQUESTED',
        entity_type: entityType,
        entity_id: entityId || null,
        metadata: {
          request_id: request?.id,
          action,
          changes
        }
      });

      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('pricing-requests', activeSchoolId));
      toast.success('Pricing change submitted for approval');
      setOfferDialogOpen(false);
      setCouponDialogOpen(false);
      setEditingOffer(null);
      setEditingCoupon(null);
      setOfferDraft({ ...DEFAULT_OFFER_DRAFT });
      setCouponDraft({ ...DEFAULT_COUPON_DRAFT });
      setOfferReason('');
      setCouponReason('');
    }
  });

  const approvePricingMutation = useMutation({
    mutationFn: async (request) => {
      if (!request) return null;
      if (request.status !== 'PENDING') return null;

      const now = new Date().toISOString();
      const entityType = request.entity_type;
      const { course_ids, ...payload } = request.proposed || {};
      let appliedEntityId = request.entity_id || null;
      let appliedPayload = payload || {};

      if (request.action === 'CREATE') {
        const createPayload = {
          ...payload,
          school_id: activeSchoolId
        };
        if (entityType === 'Offer') {
          createPayload.is_active = createPayload.is_active !== false;
          createPayload.status = createPayload.is_active ? 'active' : 'inactive';
        }
        if (entityType === 'Coupon') {
          createPayload.is_active = createPayload.is_active !== false;
        }
        const created = await scopedCreate(entityType, activeSchoolId, createPayload);
        appliedEntityId = created?.id || created?.data?.id;
      } else if (request.action === 'UPDATE') {
        if (Object.keys(payload || {}).length > 0 && request.entity_id) {
          const updatePayload = { ...payload };
          if (entityType === 'Offer' && typeof updatePayload.is_active === 'boolean') {
            updatePayload.status = updatePayload.is_active ? 'active' : 'inactive';
          }
          await scopedUpdate(entityType, request.entity_id, updatePayload, activeSchoolId, true);
          appliedPayload = updatePayload;
        }
      }

      if (entityType === 'Offer' && Array.isArray(course_ids) && appliedEntityId) {
        await syncOfferCourses(appliedEntityId, course_ids);
      }

      await scopedUpdate('PricingChangeRequest', request.id, {
        status: 'APPROVED',
        approved_by: user?.email || null,
        approved_at: now,
        applied_entity_id: appliedEntityId
      }, activeSchoolId, true);

      await scopedCreate('AuditLog', activeSchoolId, {
        school_id: activeSchoolId,
        user_email: user?.email,
        action: 'PRICE_CHANGE_APPROVED',
        entity_type: entityType,
        entity_id: appliedEntityId || request.entity_id || null,
        metadata: {
          request_id: request.id,
          action: request.action,
          applied: appliedPayload
        }
      });

      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('pricing-requests', activeSchoolId));
      queryClient.invalidateQueries(buildCacheKey('offers', activeSchoolId));
      queryClient.invalidateQueries(buildCacheKey('coupons', activeSchoolId));
      queryClient.invalidateQueries(buildCacheKey('offer-courses', activeSchoolId));
      toast.success('Pricing change approved');
    }
  });

  const rejectPricingMutation = useMutation({
    mutationFn: async ({ request, reason }) => {
      const now = new Date().toISOString();
      await scopedUpdate('PricingChangeRequest', request.id, {
        status: 'REJECTED',
        rejected_by: user?.email || null,
        rejected_at: now,
        rejection_reason: reason || null
      }, activeSchoolId, true);

      await scopedCreate('AuditLog', activeSchoolId, {
        school_id: activeSchoolId,
        user_email: user?.email,
        action: 'PRICE_CHANGE_REJECTED',
        entity_type: request.entity_type,
        entity_id: request.entity_id || null,
        metadata: {
          request_id: request.id,
          reason: reason || null
        }
      });

      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('pricing-requests', activeSchoolId));
      toast.success('Pricing change rejected');
    }
  });

  const openOfferDialog = (offer = null) => {
    const courseIds = offer ? (offerCoursesByOfferId.get(String(offer.id)) || []) : [];
    setEditingOffer(offer);
    setOfferDraft(buildOfferDraft(offer, courseIds));
    setOfferReason('');
    setOfferDialogOpen(true);
  };

  const openCouponDialog = (coupon = null) => {
    setEditingCoupon(coupon);
    setCouponDraft(buildCouponDraft(coupon));
    setCouponReason('');
    setCouponDialogOpen(true);
  };

  const pendingForEntity = (entityType, entityId) => {
    if (!entityId) return null;
    return pendingByEntity.get(`${entityType}:${entityId}`) || null;
  };

  const handleSubmitOfferRequest = (event) => {
    event.preventDefault();
    const isCreate = !editingOffer;
    const currentCourseIds = editingOffer
      ? (offerCoursesByOfferId.get(String(editingOffer.id)) || [])
      : [];
    const priceCents = normalizePriceToCents(offerDraft.price);
    const proposed = {
      name: offerDraft.name.trim(),
      description: offerDraft.description.trim(),
      offer_type: offerDraft.offer_type,
      price_cents: priceCents,
      billing_interval: offerDraft.offer_type === 'SUBSCRIPTION' ? offerDraft.billing_interval : null,
      access_scope: offerDraft.access_scope,
      is_active: offerDraft.is_active !== false,
      status: offerDraft.is_active !== false ? 'active' : 'inactive',
      course_ids: offerDraft.course_ids || []
    };

    pricingRequestMutation.mutate({
      entityType: 'Offer',
      entityId: editingOffer?.id || null,
      action: isCreate ? 'CREATE' : 'UPDATE',
      proposed,
      current: editingOffer ? {
        ...editingOffer,
        course_ids: currentCourseIds
      } : null,
      reason: offerReason
    });
  };

  const handleSubmitCouponRequest = (event) => {
    event.preventDefault();
    const isCreate = !editingCoupon;
    const proposed = {
      code: couponDraft.code.trim().toUpperCase(),
      discount_type: couponDraft.discount_type,
      discount_value: Number(couponDraft.discount_value) || 0,
      usage_limit: couponDraft.usage_limit ? Number(couponDraft.usage_limit) : null,
      expires_at: couponDraft.expires_at ? new Date(couponDraft.expires_at).toISOString() : null,
      is_active: couponDraft.is_active !== false
    };

    pricingRequestMutation.mutate({
      entityType: 'Coupon',
      entityId: editingCoupon?.id || null,
      action: isCreate ? 'CREATE' : 'UPDATE',
      proposed,
      current: editingCoupon || null,
      reason: couponReason
    });
  };

  if (isLoading) {
    return <PageShell title="Monetization" subtitle="Loading session…" />;
  }

  if (!user) {
    return <PageShell title="Monetization" subtitle="Please sign in to manage monetization." />;
  }

  if (!activeSchoolId) {
    return <PageShell title="Monetization" subtitle="Select a school to manage monetization." />;
  }

  if (!isAdmin) {
    return <PageShell title="Monetization" subtitle="School admin access required." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Monetization Dashboard</h1>
        <p className="text-slate-600">Manage offers, transactions, and revenue</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${(totalRevenue / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{offers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{transactions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{pendingTransactions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <VirtualizedList
                items={transactions}
                initialCount={24}
                chunkSize={24}
                className="space-y-3"
                getKey={(t) => t.id}
                empty={<p className="text-slate-500 text-center py-8">No transactions yet</p>}
                renderItem={(transaction) => (
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{transaction.user_email}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(transaction.created_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <div>
                        <p className="font-semibold">${(transaction.amount_cents / 100).toFixed(2)}</p>
                        <Badge
                          variant={
                            transaction.status === 'completed'
                              ? 'default'
                              : transaction.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      {transaction.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(transaction.id)}
                          disabled={approveMutation.isPending}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  {editingOffer ? `Request updates for ${editingOffer.name}` : 'Request new offer'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitOfferRequest} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={offerDraft.name}
                      onChange={(event) => setOfferDraft((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Offer Type</Label>
                    <Select
                      value={offerDraft.offer_type}
                      onValueChange={(value) => setOfferDraft((prev) => ({ ...prev, offer_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OFFER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={offerDraft.description}
                    onChange={(event) => setOfferDraft((prev) => ({ ...prev, description: event.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Price (USD)</Label>
                    <Input
                      value={offerDraft.price}
                      onChange={(event) => setOfferDraft((prev) => ({ ...prev, price: event.target.value }))}
                      placeholder="99.00"
                      required
                    />
                  </div>
                  {offerDraft.offer_type === 'SUBSCRIPTION' && (
                    <div className="space-y-2">
                      <Label>Billing Interval</Label>
                      <Select
                        value={offerDraft.billing_interval}
                        onValueChange={(value) => setOfferDraft((prev) => ({ ...prev, billing_interval: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BILLING_INTERVALS.map((interval) => (
                            <SelectItem key={interval.value} value={interval.value}>
                              {interval.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Access Scope</Label>
                    <Select
                      value={offerDraft.access_scope}
                      onValueChange={(value) => setOfferDraft((prev) => ({ ...prev, access_scope: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCESS_SCOPES.map((scope) => (
                          <SelectItem key={scope.value} value={scope.value}>
                            {scope.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(offerDraft.offer_type === 'COURSE'
                  || offerDraft.offer_type === 'BUNDLE'
                  || offerDraft.access_scope === 'SELECTED_COURSES') && (
                  <div className="space-y-3">
                    <Label>Courses included</Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      {courses.map((course) => {
                        const checked = offerDraft.course_ids.includes(String(course.id));
                        return (
                          <label key={course.id} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) => {
                                setOfferDraft((prev) => {
                                  const existing = new Set(prev.course_ids);
                                  if (value) {
                                    existing.add(String(course.id));
                                  } else {
                                    existing.delete(String(course.id));
                                  }
                                  return { ...prev, course_ids: Array.from(existing) };
                                });
                              }}
                            />
                            <span className="text-foreground">{course.title}</span>
                          </label>
                        );
                      })}
                    </div>
                    {courses.length === 0 && (
                      <p className="text-xs text-muted-foreground">No courses available yet.</p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2">
                  <Checkbox
                    checked={offerDraft.is_active}
                    onCheckedChange={(value) => setOfferDraft((prev) => ({ ...prev, is_active: !!value }))}
                  />
                  <div>
                    <p className="text-sm font-medium">Active on approval</p>
                    <p className="text-xs text-muted-foreground">New offers remain hidden until approved.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Approval reason</Label>
                  <Textarea
                    value={offerReason}
                    onChange={(event) => setOfferReason(event.target.value)}
                    placeholder="Why are you changing this offer?"
                    rows={2}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={pricingRequestMutation.isPending}>
                  Submit for approval
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Offers</CardTitle>
                <p className="text-xs text-muted-foreground">Pricing updates require approval.</p>
              </div>
              <Button onClick={() => openOfferDialog()}>
                Request New Offer
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {offers.map((offer) => {
                  const pending = pendingForEntity('Offer', offer.id);
                  const courseCount = offerCoursesByOfferId.get(String(offer.id))?.length || 0;
                  return (
                    <div key={offer.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold">{offer.name}</h4>
                            <Badge>{offer.offer_type}</Badge>
                            {offer.is_active === false && <Badge variant="secondary">Inactive</Badge>}
                            {pending && <Badge variant="outline">Pending approval</Badge>}
                          </div>
                          <p className="text-sm text-slate-600">{offer.description}</p>
                          {courseCount > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">{courseCount} courses linked</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            ${(offer.price_cents / 100).toFixed(2)}
                          </p>
                          {offer.billing_interval && (
                            <p className="text-xs text-muted-foreground">/ {offer.billing_interval}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openOfferDialog(offer)}
                          disabled={!!pending}
                        >
                          Request Change
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={!!pending}
                          onClick={() => {
                            pricingRequestMutation.mutate({
                              entityType: 'Offer',
                              entityId: offer.id,
                              action: 'UPDATE',
                              proposed: {
                                is_active: offer.is_active === false,
                                status: offer.is_active === false ? 'active' : 'inactive'
                              },
                              current: offer,
                              reason: offer.is_active === false ? 'Activate offer' : 'Deactivate offer'
                            });
                          }}
                        >
                          {offer.is_active === false ? 'Request Activation' : 'Request Deactivation'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {offers.length === 0 && (
                  <p className="text-slate-500 text-center py-8">No offers created yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons" className="mt-6">
          <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? `Request updates for ${editingCoupon.code}` : 'Request new coupon'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitCouponRequest} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Coupon Code</Label>
                    <Input
                      value={couponDraft.code}
                      onChange={(event) => setCouponDraft((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <Select
                      value={couponDraft.discount_type}
                      onValueChange={(value) => setCouponDraft((prev) => ({ ...prev, discount_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DISCOUNT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Discount Value</Label>
                    <Input
                      value={couponDraft.discount_value}
                      onChange={(event) => setCouponDraft((prev) => ({ ...prev, discount_value: event.target.value }))}
                      placeholder={couponDraft.discount_type === 'PERCENTAGE' ? '10' : '25'}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Usage Limit</Label>
                    <Input
                      value={couponDraft.usage_limit}
                      onChange={(event) => setCouponDraft((prev) => ({ ...prev, usage_limit: event.target.value }))}
                      placeholder="Leave blank for unlimited"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expires</Label>
                    <Input
                      type="date"
                      value={couponDraft.expires_at}
                      onChange={(event) => setCouponDraft((prev) => ({ ...prev, expires_at: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2">
                  <Checkbox
                    checked={couponDraft.is_active}
                    onCheckedChange={(value) => setCouponDraft((prev) => ({ ...prev, is_active: !!value }))}
                  />
                  <div>
                    <p className="text-sm font-medium">Active on approval</p>
                    <p className="text-xs text-muted-foreground">Coupons remain hidden until approved.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Approval reason</Label>
                  <Textarea
                    value={couponReason}
                    onChange={(event) => setCouponReason(event.target.value)}
                    placeholder="Why are you changing this coupon?"
                    rows={2}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={pricingRequestMutation.isPending}>
                  Submit for approval
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Coupons</CardTitle>
                <p className="text-xs text-muted-foreground">Coupon changes require approval.</p>
              </div>
              <Button onClick={() => openCouponDialog()}>
                Request New Coupon
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coupons.map((coupon) => {
                  const pending = pendingForEntity('Coupon', coupon.id);
                  return (
                    <div key={coupon.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-mono font-bold">{coupon.code}</p>
                          {coupon.is_active === false && <Badge variant="secondary">Inactive</Badge>}
                          {pending && <Badge variant="outline">Pending approval</Badge>}
                        </div>
                        <p className="text-xs text-slate-500">
                          {coupon.discount_type === 'PERCENTAGE' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`} off
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Used: {coupon.usage_count || 0}/{coupon.usage_limit || 'Unlimited'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openCouponDialog(coupon)}
                          disabled={!!pending}
                        >
                          Request Change
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={!!pending}
                          onClick={() => {
                            pricingRequestMutation.mutate({
                              entityType: 'Coupon',
                              entityId: coupon.id,
                              action: 'UPDATE',
                              proposed: { is_active: coupon.is_active === false },
                              current: coupon,
                              reason: coupon.is_active === false ? 'Activate coupon' : 'Deactivate coupon'
                            });
                          }}
                        >
                          {coupon.is_active === false ? 'Request Activation' : 'Request Deactivation'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {coupons.length === 0 && (
                  <p className="text-slate-500 text-center py-8">No coupons created yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Pricing Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No pending approvals.</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => {
                    const changes = request.changes || request.proposed || {};
                    const requestedBy = request.requested_by || 'Unknown';
                    const canApprove = !!user?.email && requestedBy.toLowerCase() !== user.email.toLowerCase();
                    return (
                      <div key={request.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {request.action} {request.entity_type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Requested by {requestedBy} · {request.requested_at ? new Date(request.requested_at).toLocaleString() : 'just now'}
                            </p>
                          </div>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                        {request.reason && (
                          <p className="text-xs text-muted-foreground">Reason: {request.reason}</p>
                        )}
                        <div className="grid gap-2 md:grid-cols-2 text-xs text-muted-foreground">
                          {Object.entries(changes).length === 0 && (
                            <span>No change details provided.</span>
                          )}
                          {Object.entries(changes).map(([key, value]) => {
                            if (value && typeof value === 'object' && 'from' in value && 'to' in value) {
                              return (
                                <span key={key}>
                                  {key}: {String(value.from)} → {String(value.to)}
                                </span>
                              );
                            }
                            return (
                              <span key={key}>
                                {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                              </span>
                            );
                          })}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => approvePricingMutation.mutate(request)}
                            disabled={!canApprove || approvePricingMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const reason = window.prompt('Reason for rejection (optional):') || '';
                              rejectPricingMutation.mutate({ request, reason });
                            }}
                            disabled={!canApprove || rejectPricingMutation.isPending}
                          >
                            Reject
                          </Button>
                          {!canApprove && (
                            <span className="text-xs text-muted-foreground">Another admin must approve this request.</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Pricing Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(pricingRequests || []).slice(0, 10).map((request) => (
                  <div key={request.id} className="flex items-center justify-between border rounded-lg p-3 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">
                        {request.action} {request.entity_type}
                      </p>
                      <p className="text-muted-foreground">
                        {request.requested_by || 'Unknown'} · {request.requested_at ? new Date(request.requested_at).toLocaleString() : 'just now'}
                      </p>
                    </div>
                    <Badge variant={request.status === 'APPROVED' ? 'default' : request.status === 'REJECTED' ? 'destructive' : 'outline'}>
                      {request.status || 'PENDING'}
                    </Badge>
                  </div>
                ))}
                {pricingRequests.length === 0 && (
                  <p className="text-slate-500 text-center py-8">No pricing requests yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <PayoutBatchManager schoolId={activeSchoolId} user={user} />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <RevenueChart schoolId={activeSchoolId} />
            <ConversionFunnel schoolId={activeSchoolId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
