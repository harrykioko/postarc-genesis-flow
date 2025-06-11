
import React from 'react';
import { Check } from 'lucide-react';
import { PricingTier } from './types';

interface PricingCardWithActionsProps {
  tier: PricingTier;
  isLoading: boolean;
  onFreeSignup: () => void;
  onUpgrade: (tier: string) => void;
}

export const PricingCardWithActions = ({ 
  tier, 
  isLoading, 
  onFreeSignup, 
  onUpgrade 
}: PricingCardWithActionsProps) => {
  const Icon = tier.icon;
  const isPro = tier.id === 'pro';
  const isLegend = tier.id === 'legend';

  return (
    <div 
      className={`bg-white rounded-xl p-6 relative ${
        isPro ? 'border-2 border-neon shadow-xl' : 'border border-slate/20'
      }`}
    >
      {tier.popular && (
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-slate">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isPro || isLegend ? 'bg-neon/20' : 'bg-slate/10'
        }`}>
          <Icon className={`w-6 h-6 ${isPro || isLegend ? 'text-neon' : 'text-slate'}`} />
        </div>
        <div>
          <h3 className="text-2xl font-heading font-bold text-midnight">{tier.name}</h3>
          <p className="text-slate text-sm">{tier.description}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="text-4xl font-heading font-bold text-midnight">
          {tier.price}<span className="text-lg font-normal text-slate">/{tier.period === 'forever' ? 'forever' : 'month'}</span>
        </div>
        <p className="text-sm text-slate mt-1">{tier.quota}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isPro || isLegend ? 'bg-neon' : 'bg-slate/20'
            }`}>
              <Check className={`w-3 h-3 ${isPro || isLegend ? 'text-midnight' : 'text-slate'}`} />
            </div>
            <span className="text-midnight text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => {
          if (tier.id === 'free') {
            onFreeSignup();
          } else {
            onUpgrade(tier.stripeTier!);
          }
        }}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus-enhanced ${
          tier.id === 'free' 
            ? 'bg-slate-100 text-midnight hover:bg-slate-200' 
            : 'bg-neon text-midnight hover:bg-neon/90'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          tier.cta
        )}
      </button>
    </div>
  );
};
