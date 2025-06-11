
import React from 'react';
import { PricingTier } from './types';
import { PricingCardWithActions } from './PricingCardWithActions';

interface PricingCardsGridProps {
  pricingTiers: PricingTier[];
  loading: string | null;
  onFreeSignup: () => void;
  onUpgrade: (tier: string) => void;
}

export const PricingCardsGrid = ({ 
  pricingTiers, 
  loading, 
  onFreeSignup, 
  onUpgrade 
}: PricingCardsGridProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {pricingTiers.map((tier) => (
        <PricingCardWithActions
          key={tier.id}
          tier={tier}
          isLoading={loading === tier.stripeTier}
          onFreeSignup={onFreeSignup}
          onUpgrade={onUpgrade}
        />
      ))}
    </div>
  );
};
