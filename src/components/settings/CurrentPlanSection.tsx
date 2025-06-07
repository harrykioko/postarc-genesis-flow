
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap, CreditCard, FileText } from "lucide-react";
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
    price: "Free forever",
    features: ["Basic templates", "7-day history", "Standard support"],
    upgradeText: "Upgrade to Pro",
    icon: Star,
    badgeColor: "bg-gray-100 text-gray-700",
    tier: 'pro'
  },
  pro: {
    name: "Pro Plan", 
    quota: "15 posts per month",
    price: "$9/month",
    features: ["Custom templates", "Unlimited history", "Priority support", "Advanced analytics"],
    upgradeText: "Upgrade to Legend",
    icon: Crown,
    badgeColor: "bg-blue-100 text-blue-700",
    tier: 'legend'
  },
  legend: {
    name: "Legend Plan",
    quota: "Unlimited posts", 
    price: "$25/month",
    features: ["Everything in Pro", "Advanced analytics", "White-label options", "Custom branding"],
    upgradeText: null,
    icon: Zap,
    badgeColor: "bg-purple-100 text-purple-700",
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
    <Card className="bg-white border-slate/10 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-neon/10 transition-all duration-200">
      <CardHeader>
        <CardTitle className="font-heading text-midnight flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-neon" />
            <span>Current Plan</span>
          </div>
          <Badge className={currentPlan.badgeColor}>
            {currentPlan.name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Overview */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-midnight text-lg">{currentPlan.name}</h3>
            <p className="text-slate">{currentPlan.quota}</p>
            <p className="text-sm font-medium text-neon">{currentPlan.price}</p>
          </div>
        </div>

        {/* Billing Information */}
        {showBilling && (
          <div className="billing-info p-4 bg-slate/5 rounded-lg">
            <h4 className="text-sm font-medium text-midnight mb-3">Billing Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-slate">Next billing:</span>
                <div className="font-medium text-midnight">
                  {formatDate(subscription?.current_period_end)}
                </div>
              </div>
              <div>
                <span className="text-slate">Plan:</span>
                <div className="font-medium text-midnight">{currentPlan.price}</div>
              </div>
            </div>
            
            {/* Billing Management Links */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={openCustomerPortal}
                className="border-midnight text-midnight hover:bg-neon hover:text-midnight hover:border-neon"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={openCustomerPortal}
                className="border-midnight text-midnight hover:bg-neon hover:text-midnight hover:border-neon"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Invoices
              </Button>
            </div>
          </div>
        )}

        {/* Plan Features */}
        <div className="features">
          <h4 className="text-sm font-medium text-midnight mb-3">What's included:</h4>
          <ul className="space-y-2">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-slate">
                <Check className="w-4 h-4 text-neon mr-3 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade Button */}
        {currentPlan.upgradeText && (
          <Button 
            className="w-full bg-neon text-midnight hover:bg-neon/90 font-semibold transition-all duration-200"
            onClick={() => handleUpgrade(currentPlan.tier!)}
          >
            {currentPlan.upgradeText}
          </Button>
        )}

        {/* Cancel/Downgrade for paid plans */}
        {showBilling && (
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full text-slate hover:text-red-600 transition-colors"
            onClick={handleCancelSubscription}
          >
            Cancel Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
