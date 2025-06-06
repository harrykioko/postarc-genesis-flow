
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Pricing = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFreeSignup = () => {
    setShowAuthModal(true);
  };

  const handleUpgradeToPro = async () => {
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
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="glass-card p-8 rounded-2xl relative">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-neon" />
              <h3 className="text-2xl font-heading font-bold text-midnight">Free</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-midnight">$0</span>
              <span className="text-slate">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-neon" />
                <span>5 post generations per month</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-neon" />
                <span>All professional templates</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-neon" />
                <span>Share to LinkedIn</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-neon" />
                <span>Post history (last 20)</span>
              </li>
            </ul>
            
            <Button 
              onClick={handleFreeSignup}
              className="w-full btn-primary py-3"
            >
              Get Started Free
            </Button>
          </div>
          
          <div className="glass-card-strong p-8 rounded-2xl relative border-2 border-neon">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-neon text-midnight">
              Most Popular
            </Badge>
            
            <div className="flex items-center space-x-2 mb-6">
              <Crown className="w-6 h-6 text-neon" />
              <h3 className="text-2xl font-heading font-bold text-midnight">Pro</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-midnight">$25</span>
              <span className="text-slate">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-neon" />
                <span><strong>Unlimited</strong> post generations</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-neon" />
                <span>All professional templates</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-neon" />
                <span>Priority AI processing</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-neon" />
                <span>Complete post history</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-neon" />
                <span>URL content scraping</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-neon" />
                <span>Custom brand voice</span>
              </li>
            </ul>
            
            <Button 
              onClick={handleUpgradeToPro}
              disabled={loading}
              className="w-full btn-neon py-3"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Upgrade to Pro'
              )}
            </Button>
          </div>
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
