import React from 'react';
import { tokens, cx } from '@/components/theme/tokens';

export default function StatCard({ icon: Icon, label, value, color, bg }) {
  // Fallback for legacy gradient props if 'bg' isn't provided
  const iconBgClass = bg || `bg-gradient-to-br ${color}`;
  
  return (
    <div className={cx(tokens.glass.card, tokens.glass.cardHover)}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={tokens.text.meta}>{label}</p>
            <p className="text-3xl font-bold tracking-tight mt-1 text-foreground">{value}</p>
          </div>
          <div className={cx("w-12 h-12 rounded-xl flex items-center justify-center", iconBgClass)}>
            <Icon className={cx("w-6 h-6", color.includes('text-') ? color : 'text-white')} />
          </div>
        </div>
      </div>
    </div>
  );
}