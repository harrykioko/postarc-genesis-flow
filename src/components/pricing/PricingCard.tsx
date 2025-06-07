
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PricingTier } from "./types";

interface PricingCardProps {
  tier: PricingTier;
  onFreeSignup: () => void;
  onUpgrade: (tierName: string) => void;
}

export const PricingCard = ({ tier, onFreeSignup, onUpgrade }: PricingCardProps) => {
  const Icon = tier.icon;
  const isPro = tier.id === 'pro';
  const isLegend = tier.id === 'legend';
  const isFree = tier.id === 'free';

  return (
    <div 
      className={`
        relative group transition-all duration-300 hover:scale-105
        ${isPro ? 'md:-mt-8 md:mb-8 z-10' : 'z-0'}
      `}
    >
      {/* Background glow effect for Pro tier */}
      {isPro && (
        <div className="absolute -inset-4 bg-gradient-to-r from-neon/20 via-mint/30 to-neon/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
      )}
      
      {/* Most Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-neon to-mint px-6 py-2 rounded-full shadow-lg border-2 border-white">
            <span className="text-midnight font-heading font-bold text-sm">
              ⭐ Most Popular
            </span>
          </div>
        </div>
      )}
      
      <div 
        className={`
          relative glass-card rounded-2xl transition-all duration-300 group-hover:shadow-2xl
          ${isPro ? 
            'border-2 border-neon glass-card-strong p-8 md:p-10 bg-gradient-to-br from-white/90 to-neon/5' : 
            'p-8 border border-slate/20 bg-white/70 hover:bg-white/80'
          }
          ${isPro ? 'md:scale-110' : ''}
        `}
      >
        {/* Card top edge enhancement */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
          isPro ? 'bg-gradient-to-r from-neon via-mint to-neon' : 
          isLegend ? 'bg-gradient-to-r from-slate/30 to-midnight/30' :
          'bg-gradient-to-r from-slate/20 to-slate/40'
        }`}></div>
        
        <div className={`flex items-center space-x-3 ${isPro ? 'mb-8' : 'mb-6'}`}>
          <div className={`
            p-3 rounded-full transition-all duration-300
            ${isPro ? 'bg-neon/20 group-hover:bg-neon/30' : 
              isLegend ? 'bg-midnight/10 group-hover:bg-midnight/20' : 
              'bg-slate/10 group-hover:bg-slate/20'}
          `}>
            <Icon className={`
              w-6 h-6 transition-colors duration-300
              ${isPro ? 'text-neon' : 
                isLegend ? 'text-midnight' : 
                'text-slate'}
            `} />
          </div>
          <h3 className={`
            font-heading font-bold text-midnight
            ${isPro ? 'text-3xl' : 'text-2xl'}
          `}>
            {tier.name}
          </h3>
        </div>
        
        <div className={`${isPro ? 'mb-8' : 'mb-6'}`}>
          <span className={`
            font-bold text-midnight
            ${isPro ? 'text-5xl' : 'text-4xl'}
          `}>
            {tier.price}
          </span>
          <span className="text-slate ml-1">
            /{tier.period === 'forever' ? 'forever' : 'month'}
          </span>
        </div>
        
        <div className={`${isPro ? 'mb-8' : 'mb-6'}`}>
          <p className={`
            font-medium text-slate
            ${isPro ? 'text-base' : 'text-sm'}
          `}>
            {tier.quota}
          </p>
        </div>
        
        <ul className={`space-y-4 ${isPro ? 'mb-10' : 'mb-8'}`}>
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center
                ${isPro ? 'bg-neon' : 
                  isLegend ? 'bg-midnight/20' : 
                  'bg-slate/20'}
              `}>
                <Check className={`
                  w-3 h-3
                  ${isPro ? 'text-midnight' : 
                    isLegend ? 'text-midnight' : 
                    'text-slate'}
                `} />
              </div>
              <span className={`
                text-midnight
                ${isPro ? 'font-medium' : ''}
              `}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={() => {
            if (tier.id === 'free') {
              onFreeSignup();
            } else {
              onUpgrade(tier.stripeTier!);
            }
          }}
          className={`
            w-full transition-all duration-300 transform hover:scale-105
            ${isPro ? 'py-4 text-lg font-bold' : 'py-3'}
            ${tier.id === 'free' ? 
              'btn-primary hover:shadow-lg' : 
              isPro ? 'btn-neon hover:shadow-xl hover:shadow-neon/30' :
              'btn-primary hover:shadow-lg'
            }
          `}
        >
          {tier.cta}
        </Button>
      </div>
    </div>
  );
};
