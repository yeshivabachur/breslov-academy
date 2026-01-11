import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { scopedFilter } from '@/components/api/scoped';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import useStorefrontContext from '@/components/hooks/useStorefrontContext';
import { checkRateLimit } from '@/components/security/rateLimiter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Tag, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SchoolCheckout() {
  const [user, setUser] = useState(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { schoolSlug: slug, offerId, refCode } = useStorefrontContext();
  const schoolFields = [
    'id',
    'name',
    'slug'
  ];
  const offerFields = [
    'id',
    'name',
    'description',
    'offer_type',
    'price_cents',
    'billing_interval',
    'access_scope'
  ];
  const couponFields = [
    'id',
    'code',
    'discount_type',
    'discount_value',
    'is_active'
  ];

  // v9.4 Hardening: Checkout Idempotency Key
  const checkoutIdRef = React.useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        // Guest checkout allowed - no redirect
      }
    };
    loadUser();
  }, []);

  // Track checkout started
  useEffect(() => {
    if (school && offer) {
      import('../components/analytics/track').then(({ trackEvent }) => {
        trackEvent({
          school_id: school.id,
          user_email: user?.email,
          event_type: 'started_checkout',
          entity_type: 'Offer',
          entity_id: offer.id,
          meta: { idempotency_key: checkoutIdRef.current }
        });
      });
    }
  }, [school, offer, user]);

  const { data: school } = useQuery({
    queryKey: ['school-by-slug', slug],
    queryFn: async () => {
      const schools = await base44.entities.School.filter({ slug }, null, 1, { fields: schoolFields });
      return schools[0];
    },
    enabled: !!slug
  });

  const { data: offer } = useQuery({
    queryKey: ['offer', school?.id, offerId],
    queryFn: async () => {
      const offers = await scopedFilter('Offer', school.id, { id: offerId, is_active: true }, null, 1, { fields: offerFields });
      return offers[0];
    },
    enabled: !!school?.id && !!offerId
  });

  const { data: coupon } = useQuery({
    queryKey: ['coupon', couponCode, school?.id],
    queryFn: async () => {
      if (!couponCode) return null;
      const coupons = await scopedFilter(
        'Coupon',
        school.id,
        { code: couponCode },
        null,
        1,
        { fields: couponFields }
      );
      return coupons[0];
    },
    enabled: !!couponCode && !!school
  });

  const handleApplyCoupon = () => {
    if (coupon) {
      const discountAmount = coupon.discount_type === 'PERCENTAGE'
        ? (offer.price_cents * coupon.discount_value / 100)
        : coupon.discount_value * 100;
      setDiscount(discountAmount);
      toast.success('Coupon applied!');
      
      // Track coupon applied
      import('../components/analytics/track').then(({ trackEvent }) => {
        trackEvent({
          school_id: school.id,
          user_email: user?.email,
          event_type: 'applied_coupon',
          metadata: { coupon_code: couponCode, discount_cents: discountAmount }
        });
      });
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleCheckout = async () => {
    const email = user?.email || guestEmail;
    if (!email) {
      toast.error('Please provide an email address');
      return;
    }

    if (isSubmitting) return;

    // Rate limit check
    const { allowed } = await checkRateLimit('checkout', email, school.id);
    if (!allowed) {
      toast.error('Too many attempts. Please try again later.');
      return;
    }

    setIsSubmitting(true);

    const attributionModule = await import('../components/analytics/attribution');
    const attribution = attributionModule.getAttribution({ schoolSlug: slug });
    const metadata = attributionModule.attachAttribution({
      referral_code: refCode || undefined,
      idempotency_key: checkoutIdRef.current,
    }, attribution);

    try {
      const stripeResponse = await base44.request('/stripe/checkout', {
        method: 'POST',
        body: {
          school_id: school.id,
          offer_id: offer.id,
          email,
          coupon_code: couponCode || undefined,
          idempotency_key: checkoutIdRef.current,
          referral_code: refCode || undefined,
          metadata,
          success_url: `${window.location.origin}/s/${slug}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/s/${slug}/pricing`,
        }
      });

      if (stripeResponse?.url) {
        window.location.assign(stripeResponse.url);
        return;
      }
    } catch (error) {
      if (error?.status !== 409) {
        toast.error('Stripe checkout failed, using manual payment.');
      }
    }

    try {
      const manual = await base44.request('/checkout/create', {
        method: 'POST',
        body: {
          school_id: school.id,
          offer_id: offer.id,
          email,
          coupon_code: couponCode || undefined,
          idempotency_key: checkoutIdRef.current,
          referral_code: refCode || undefined,
          metadata,
        }
      });
      if (manual?.transaction_id) {
        navigate(createPageUrl(`SchoolThankYou?slug=${slug}&transactionId=${manual.transaction_id}`));
        return;
      }
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!offer || !school) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  const finalAmount = Math.max(0, offer.price_cents - discount);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Purchase</h1>

        <div className="grid gap-6">
          {/* Order Summary */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-lg">{offer.name}</span>
                  <p className="text-sm text-muted-foreground">{school.name}</p>
                </div>
                <span className="font-bold text-lg">${(offer.price_cents / 100).toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Discount ({couponCode})
                  </span>
                  <span>-${(discount / 100).toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-4 flex justify-between text-2xl font-black">
                <span>Total</span>
                <span className="text-primary">${(finalAmount / 100).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Coupon */}
          <Card className="shadow-sm">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Apply Promo Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="bg-white"
                />
                <Button onClick={handleApplyCoupon} variant="outline" className="shrink-0">
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email (for guests) */}
          {!user && (
            <Card className="shadow-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">Where should we send your access?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-12 bg-white"
                      required
                    />
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-xs text-blue-800 leading-normal">
                      Your login credentials and payment instructions will be sent to this address immediately after checkout.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method & Trust */}
          <Card className="shadow-sm border-amber-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                Secure Checkout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-6 text-center">
                <p className="text-amber-900 font-bold mb-3">
                  Fast checkout options
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  If card payments are enabled for this school, you will be redirected to secure Stripe checkout.
                  Otherwise, manual payment instructions (Bank Transfer, Zelle, PayPal) will be sent by email.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  14-Day Money Back Guarantee
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Lock className="w-4 h-4 text-green-600" />
                  SSL Secure Connection
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-bold shadow-lg"
            onClick={handleCheckout}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing Securely...' : 'Complete Order & Get Access'}
          </Button>

          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
            Transaction ID: {checkoutIdRef.current}
          </p>
        </div>
      </div>
    </div>
  );
}
