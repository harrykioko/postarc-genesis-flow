
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    quota: '5 posts/month',
    icon: Sparkles,
    features: [
      '5 posts per month',
      '5 basic templates',
      'Copy & share to LinkedIn',
      '7-day post history'
    ],
    limitations: [
      'No post editing',
      'Limited templates', 
      'Basic support only'
    ],
    cta: 'Get Started',
    popular: false,
    disabled: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    period: 'per month',
    quota: '15 posts/month',
    icon: Crown,
    features: [
      '15 posts per month',
      'All premium templates',
      'Full post editing',
      'Unlimited post history',
      'Priority support',
      'Save drafts'
    ],
    cta: 'Start Pro',
    popular: true,
    stripeTier: 'pro'
  },
  {
    id: 'legend',
    name: 'Legend',
    price: '$25',
    period: 'per month',
    quota: 'Unlimited posts',
    icon: Zap,
    features: [
      'Unlimited posts',
      'Advanced analytics',
      'Content calendar',
      'Team features',
      'Priority support',
      'Custom templates',
      'API access'
    ],
    cta: 'Go Legend',
    popular: false,
    stripeTier: 'legend'
  }
];

export const Pricing = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFreeSignup = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleUpgrade = (tier: string) => {
    if (user) {
      navigate(`/dashboard?upgrade=${tier}`);
    } else {
      navigate(`/auth?intent=upgrade&tier=${tier}`);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-white/50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            Start free and upgrade when you're ready to scale your thought leadership
          </p>
        </div>
        
        {/* Enhanced pricing grid with featured center card */}
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {pricingTiers.map((tier, index) => {
              const Icon = tier.icon;
              const isPro = tier.id === 'pro';
              const isLegend = tier.id === 'legend';
              const isFree = tier.id === 'free';
              
              return (
                <div 
                  key={tier.id}
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
                          handleFreeSignup();
                        } else {
                          handleUpgrade(tier.stripeTier!);
                        }
                      }}
                      className={`
                        w-full transition-all duration-300 transform hover:scale-105
                        ${isPro ? 'py-4 text-lg font-bold' : 'py-3'}
                        ${tier.id === 'free' ? 
                          'btn-primary hover:shadow-lg' : 
                          'btn-neon hover:shadow-xl hover:shadow-neon/30'
                        }
                      `}
                    >
                      {tier.cta}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="text-center mt-16">
          <p className="text-slate">
            All plans include our 30-day money-back guarantee. 
            <a href="mailto:support@postarc.ai" className="text-midnight hover:underline ml-1">Questions?</a>
          </p>
        </div>
      </div>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </section>
  );
};
