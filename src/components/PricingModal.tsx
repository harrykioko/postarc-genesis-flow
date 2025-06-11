import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    quota: '5 posts/month',
    icon: Sparkles,
    description: 'Try it out',
    features: [
      '5 posts per month',
      '5 basic templates',
      'Copy & share to LinkedIn',
      '7-day post history'
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
    description: 'Perfect for regular creators',
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
    description: 'For power users',
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

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick?: () => void;
  currentUsage: number;
  limit: number;
  resetDate: string;
}

export const PricingModal = ({ 
  isOpen, 
  onClose, 
  onAuthClick,
  currentUsage, 
  limit, 
  resetDate 
}: PricingModalProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, session } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = async (tier: string) => {
    if (!user) {
      navigate(`/auth?intent=upgrade&tier=${tier}`);
      onClose();
      return;
    }

    // Check if we have a valid session
    if (!session?.access_token) {
      console.error('❌ No valid session found');
      toast({
        title: "Session expired",
        description: "Please sign in again to upgrade",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setLoading(tier);
    try {
      console.log(`🚀 Starting Stripe checkout for tier: ${tier}`);
      console.log('✅ Session valid:', !!session);
      console.log('👤 User ID:', user.id);
      console.log('📧 User email:', user.email);
      
      // Use the session-aware client with explicit auth header
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { tier },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      
      console.log('📦 Checkout response:', { data, error });
      
      if (error) {
        console.error("❌ Checkout error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      if (data?.url) {
        console.log("✅ Checkout session created, opening Stripe...");
        window.open(data.url, '_blank');
        onClose();
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error: any) {
      console.error('🚨 Upgrade error:', error);
      
      let errorMessage = "Failed to start checkout process. Please try again.";
      
      if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
        errorMessage = "Your session has expired. Please sign in again.";
        // Redirect to auth with upgrade intent
        setTimeout(() => {
          navigate(`/auth?intent=upgrade&tier=${tier}`);
        }, 2000);
      } else if (error.message?.includes('Authentication failed')) {
        errorMessage = "Authentication failed. Please sign in again.";
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
      
      toast({
        title: "Upgrade Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleFreeSignup = () => {
    if (!user) {
      navigate('/auth');
      onClose();
      return;
    }

    onClose();
    if (onAuthClick) {
      onAuthClick();
    }
  };

  const formatResetDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "next month";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="relative p-6 border-b border-slate/10">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors focus-enhanced"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate" />
          </button>
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-midnight mb-2">
              Simple, transparent pricing
            </h2>
            <p className="text-slate text-lg">
              Start free and upgrade when you're ready to scale your thought leadership
            </p>
          </div>
        </div>

        {/* Usage Alert */}
        {currentUsage > 0 && (
          <div className="p-6 bg-neon/10 border-b border-slate/10">
            <div className="text-center">
              {currentUsage === limit ? (
                <p className="text-midnight font-medium">
                  You've used all <strong>{currentUsage}</strong> of your <strong>{limit}</strong> demo posts. Create an account to keep posting!
                </p>
              ) : (
                <>
                  <p className="text-midnight font-medium">
                    You've used <strong>{currentUsage}</strong> of your <strong>{limit}</strong> free posts this month.
                  </p>
                  <p className="text-slate text-sm mt-1">
                    Your quota resets on {formatResetDate(resetDate)}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingTiers.map((tier) => {
              const Icon = tier.icon;
              const isPro = tier.id === 'pro';
              const isLegend = tier.id === 'legend';
              const isLoading = loading === tier.stripeTier;
              
              return (
                <div 
                  key={tier.id}
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
                        handleFreeSignup();
                      } else {
                        handleUpgrade(tier.stripeTier!);
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
            })}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-slate/10">
            <p className="text-slate text-sm">
              All plans include our 30-day money-back guarantee. 
              <a href="mailto:support@postarc.ai" className="text-neon hover:underline ml-1 font-medium">
                Questions?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
