
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap, CreditCard, FileText, Template, History, Document } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CurrentPlanSectionProps {
  userRole: string;
  subscription: any;
  onRefresh: () => void;
}

const planDetails = {
  free: {
    name: "Free Plan",
    quota: "5 posts per month",
    price: "Free",
    period: "forever",
    features: [
      { icon: Template, text: "Basic templates" },
      { icon: History, text: "7-day history" },
      { icon: Star, text: "Standard support" }
    ],
    upgradeText: "Upgrade to Pro",
    icon: Star,
    tier: 'pro'
  },
  pro: {
    name: "Pro Plan", 
    quota: "15 posts per month",
    price: "$9",
    period: "month",
    features: [
      { icon: Template, text: "Custom templates" },
      { icon: History, text: "Unlimited history" },
      { icon: Star, text: "Priority support" },
      { icon: Document, text: "Advanced analytics" }
    ],
    upgradeText: "Upgrade to Legend",
    icon: Crown,
    tier: 'legend'
  },
  legend: {
    name: "Legend Plan",
    quota: "Unlimited posts", 
    price: "$25",
    period: "month",
    features: [
      { icon: Template, text: "Everything in Pro" },
      { icon: Document, text: "Advanced analytics" },
      { icon: Star, text: "White-label options" },
      { icon: Crown, text: "Custom branding" }
    ],
    upgradeText: null,
    icon: Zap,
    tier: null
  }
};

export const CurrentPlanSection = ({ userRole, subscription, onRefresh }: CurrentPlanSectionProps) => {
  const { toast } = useToast();
  const currentPlan = planDetails[userRole as keyof typeof planDetails] || planDetails.free;
  const showBilling = userRole !== 'free' && subscription;
  const Icon = currentPlan.icon;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleUpgrade = async (tier: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { tier }
      });
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast({
        title: "Upgrade unavailable",
        description: "Please contact support to upgrade your plan.",
        variant: "destructive"
      });
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Customer portal error:', error);
      toast({
        title: "Portal unavailable",
        description: "Please contact support to manage your billing.",
        variant: "destructive"
      });
    }
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Cancel subscription",
      description: "Please use the 'Manage Billing' button to cancel your subscription.",
    });
    openCustomerPortal();
  };

  return (
    <div className="account-settings max-w-2xl mx-auto space-y-6">
      {/* Plan Header Card */}
      <div className="plan-header-card bg-gradient-to-r from-neon/10 to-neon/5 rounded-xl p-6 border border-neon/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neon/20 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-neon" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-midnight">{currentPlan.name}</h2>
              <p className="text-slate">{currentPlan.quota}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-neon">{currentPlan.price}</div>
            <div className="text-sm text-slate">per {currentPlan.period}</div>
          </div>
        </div>
      </div>

      {/* Billing Information Card */}
      {showBilling && (
        <div className="billing-card bg-white rounded-xl p-6 border border-slate/20 shadow-sm">
          <h3 className="text-lg font-semibold text-midnight mb-4">Billing Information</h3>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-slate">Next billing</label>
              <div className="text-midnight font-medium">
                {formatDate(subscription?.current_period_end)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate">Amount</label>
              <div className="text-midnight font-medium">{currentPlan.price}/{currentPlan.period}</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-slate/30 text-midnight hover:bg-neon/10 hover:border-neon/30"
              onClick={openCustomerPortal}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-slate/30 text-midnight hover:bg-neon/10 hover:border-neon/30"
              onClick={openCustomerPortal}
            >
              <FileText className="w-4 h-4 mr-2" />
              View Invoices
            </Button>
          </div>
        </div>
      )}

      {/* Features Card */}
      <div className="features-card bg-white rounded-xl p-6 border border-slate/20 shadow-sm">
        <h3 className="text-lg font-semibold text-midnight mb-4">What's included</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {currentPlan.features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neon/10 rounded-lg flex items-center justify-center">
                  <FeatureIcon className="w-4 h-4 text-neon" />
                </div>
                <span className="text-slate">{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions Section */}
      <div className="actions-section space-y-4">
        {/* Upgrade Button */}
        {currentPlan.upgradeText && (
          <Button 
            className="w-full bg-gradient-to-r from-neon to-neon/90 hover:from-neon/90 hover:to-neon text-midnight font-medium py-3 transition-all duration-200"
            onClick={() => handleUpgrade(currentPlan.tier!)}
          >
            <Star className="w-4 h-4 mr-2" />
            {currentPlan.upgradeText}
          </Button>
        )}

        {/* Cancel/Downgrade for paid plans */}
        {showBilling && (
          <div className="text-center">
            <button 
              className="text-slate hover:text-red-600 text-sm transition-colors"
              onClick={handleCancelSubscription}
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
