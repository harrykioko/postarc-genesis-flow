
import React, { useState } from 'react';
import { X, Check, Crown, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      console.log("🚀 Starting Stripe checkout process...");
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      
      if (error) {
        console.error("❌ Checkout error:", error);
        throw error;
      }

      if (data?.url) {
        console.log("✅ Checkout session created, opening Stripe...");
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        onClose(); // Close the modal after opening checkout
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('🚨 Upgrade error:', error);
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFreeSignup = () => {
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="relative p-6 border-b border-slate/10">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-slate/10 rounded-full transition-colors focus-enhanced"
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
        <div className="p-6 bg-gradient-to-r from-neon/5 to-mint/5 border-b border-slate/10">
          <div className="text-center">
            <p className="text-midnight font-medium">
              You've used all <strong>{currentUsage}</strong> of your <strong>{limit}</strong> free posts this month.
            </p>
            <p className="text-slate text-sm mt-1">
              Your quota resets on {formatResetDate(resetDate)}
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card border border-slate/20 rounded-xl p-6 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-slate" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-midnight">Free</h3>
                  <p className="text-slate text-sm">Perfect for getting started</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-4xl font-heading font-bold text-midnight">
                  $0<span className="text-lg font-normal text-slate">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-slate/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate" />
                  </div>
                  <span className="text-midnight">5 post generations per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-slate/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate" />
                  </div>
                  <span className="text-midnight">All professional templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-slate/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate" />
                  </div>
                  <span className="text-midnight">Share to LinkedIn</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-slate/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate" />
                  </div>
                  <span className="text-midnight">Post history (last 20)</span>
                </li>
              </ul>

              <button 
                onClick={handleFreeSignup}
                className="w-full py-3 px-4 bg-slate/10 text-midnight rounded-lg font-medium hover:bg-slate/20 transition-colors focus-enhanced"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="glass-card-strong border-2 border-neon rounded-xl p-6 relative shadow-xl bg-gradient-to-br from-neon/5 to-mint/5">
              {/* Most Popular Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-neon text-midnight px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-12 h-12 bg-neon/20 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-neon" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-midnight">Pro</h3>
                  <p className="text-slate text-sm">Everything you need to scale</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-4xl font-heading font-bold text-midnight">
                  $25<span className="text-lg font-normal text-slate">/month</span>
                </div>
                <p className="text-sm text-slate mt-1">30-day money-back guarantee</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-neon rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-midnight" />
                  </div>
                  <span className="text-midnight font-medium">Unlimited post generations</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-neon rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-midnight" />
                  </div>
                  <span className="text-midnight">All professional templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-neon rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-midnight" />
                  </div>
                  <span className="text-midnight">Priority AI processing</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-neon rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-midnight" />
                  </div>
                  <span className="text-midnight">Complete post history</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-neon rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-midnight" />
                  </div>
                  <span className="text-midnight">URL content scraping</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-neon rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-midnight" />
                  </div>
                  <span className="text-midnight">Custom brand voice</span>
                </li>
              </ul>

              <button 
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 px-4 btn-neon rounded-lg font-semibold text-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus-enhanced"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Upgrade to Pro - $25/month'
                )}
              </button>
            </div>
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
