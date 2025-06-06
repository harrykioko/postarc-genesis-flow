
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, BarChart3 } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

export const SummaryMetrics = () => {
  const { profile } = useUserProfile();
  
  // Mock data - in real app this would come from analytics
  const postsUsed = 2;
  const postsLimit = 5;
  const usagePercentage = (postsUsed / postsLimit) * 100;
  const isPro = profile?.subscription_tier === 'pro';
  const shouldShowUpgrade = !isPro && postsUsed >= 4;

  return (
    <div className="glass-card p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-heading font-semibold text-midnight mb-4">
        Your Plan & Activity
      </h3>
      
      {/* Usage Stats */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate">Posts Used</span>
            <span className="text-sm font-semibold text-midnight">
              {postsUsed} of {postsLimit}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate">Plan</span>
          <Badge variant={isPro ? "default" : "secondary"} className="bg-neon/20 text-midnight">
            {isPro ? "Pro" : "Free"}
          </Badge>
        </div>
      </div>

      {/* Upgrade CTA */}
      {shouldShowUpgrade && (
        <Button className="w-full btn-neon mb-4">
          Upgrade to Pro
        </Button>
      )}

      {/* Future Analytics Placeholders */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-midnight mb-2">Analytics (Coming Soon)</h4>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-slate" />
            <span className="text-slate">Avg. Engagement</span>
          </div>
          <span className="text-xs text-slate">--</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate" />
            <span className="text-slate">Most-Used Tone</span>
          </div>
          <span className="text-xs text-slate">--</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-slate" />
            <span className="text-slate">Avg. Post Length</span>
          </div>
          <span className="text-xs text-slate">--</span>
        </div>
      </div>
    </div>
  );
};
