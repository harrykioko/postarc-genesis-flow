
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
    <section id="pricing" className="py-20 bg-white/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            Start free and upgrade when you're ready to scale your thought leadership
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => {
            const Icon = tier.icon;
            const isPro = tier.id === 'pro';
            const isLegend = tier.id === 'legend';
            
            return (
              <div 
                key={tier.id}
                className={`glass-card p-8 rounded-2xl relative ${
                  isPro ? 'border-2 border-neon glass-card-strong' : ''
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-neon text-midnight">
                    ⭐ Most Popular
                  </Badge>
                )}
                
                <div className="flex items-center space-x-2 mb-6">
                  <Icon className={`w-6 h-6 ${isPro || isLegend ? 'text-neon' : 'text-slate'}`} />
                  <h3 className="text-2xl font-heading font-bold text-midnight">{tier.name}</h3>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-midnight">{tier.price}</span>
                  <span className="text-slate">/{tier.period === 'forever' ? 'forever' : 'month'}</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm font-medium text-slate">{tier.quota}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className={`w-5 h-5 ${isPro || isLegend ? 'text-neon' : 'text-slate'}`} />
                      <span className="text-midnight">{feature}</span>
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
                  className={`w-full py-3 ${
                    tier.id === 'free' 
                      ? 'btn-primary' 
                      : 'btn-neon'
                  }`}
                >
                  {tier.cta}
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
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
