import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CouponRedemption({ onApply }) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState(null);

  const validateCoupon = (couponCode) => {
    const validCoupons = {
      'SHABBAT20': { discount: 20, type: 'percent' },
      'FIRSTTIME': { discount: 50, type: 'percent' },
      'BRESLOV25': { discount: 25, type: 'percent' }
    };

    return validCoupons[couponCode.toUpperCase()];
  };

  const applyCoupon = () => {
    const coupon = validateCoupon(code);
    if (coupon) {
      setApplied(coupon);
      setError(null);
      onApply?.(coupon);
    } else {
      setError('Invalid coupon code');
      setApplied(null);
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-slate-900">Promo Code</h3>
        </div>

        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code..."
            className="flex-1 rounded-xl uppercase"
            disabled={!!applied}
          />
          {!applied ? (
            <Button
              onClick={applyCoupon}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl"
            >
              Apply
            </Button>
          ) : (
            <Button
              onClick={() => {
                setApplied(null);
                setCode('');
              }}
              variant="outline"
              className="rounded-xl"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {applied && (
          <div className="p-3 bg-green-50 rounded-xl border border-green-200 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <div className="font-bold text-green-900">Coupon Applied!</div>
              <div className="text-sm text-green-700">{applied.discount}% discount</div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-200">
            <div className="text-sm text-red-900">{error}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}