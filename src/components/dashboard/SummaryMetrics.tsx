
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, BarChart3, Crown } from "lucide-react";

interface SummaryMetricsProps {
  quota: { used: number; total: number };
}

export const SummaryMetrics = ({ quota }: SummaryMetricsProps) => {
  const usagePercentage = (quota.used / quota.total) * 100;
  const isNearLimit = quota.used >= 4 && quota.total === 5; // Free plan logic
  const isPlanFree = quota.total === 5; // Assuming 5 is free plan limit

  return (
    <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
      <CardHeader>
        <CardTitle className="font-heading text-midnight flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-neon" />
          <span>Your Plan & Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-midnight">Posts Used</span>
            <span className="text-sm font-semibold text-midnight">
              {quota.used} of {quota.total}
            </span>
          </div>
          <Progress 
            value={usagePercentage} 
            className="h-3 bg-slate/20"
          />
          {isNearLimit && (
            <p className="text-xs text-slate">You're almost at your limit!</p>
          )}
        </div>

        {/* Plan Tier */}
        <div className="flex items-center justify-between p-3 bg-slate/5 rounded-lg">
          <div className="flex items-center space-x-2">
            <Crown className={`w-4 h-4 ${isPlanFree ? 'text-slate' : 'text-neon'}`} />
            <span className="font-medium text-midnight">
              {isPlanFree ? 'Free Plan' : 'Pro Plan'}
            </span>
          </div>
          <div className={`w-2 h-2 rounded-full ${
            quota.used >= quota.total ? 'bg-red-500' : 
            isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
          }`} />
        </div>

        {/* Upgrade CTA */}
        {isPlanFree && isNearLimit && (
          <Button className="w-full bg-neon text-midnight hover:bg-neon/90 font-semibold">
            Upgrade to Pro
          </Button>
        )}

        {/* Future Analytics Placeholders */}
        <div className="space-y-4 pt-4 border-t border-slate/10">
          <h4 className="text-sm font-semibold text-midnight">Coming Soon</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-slate" />
                <span className="text-xs text-slate">Avg. engagement</span>
              </div>
              <span className="text-xs text-slate">—</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate" />
                <span className="text-xs text-slate">Most used style</span>
              </div>
              <span className="text-xs text-slate">—</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-slate" />
                <span className="text-xs text-slate">Avg. post length</span>
              </div>
              <span className="text-xs text-slate">—</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
