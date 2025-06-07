
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, BarChart3, Crown, FileText, Calendar, Star, Clock, User } from "lucide-react";
import { useQuota } from "@/hooks/useQuota";
import { useUserStats } from "@/hooks/useUserStats";
import { StatCard } from "./StatCard";

interface PlanActivitySectionProps {
  onUpgrade?: () => void;
}

export const PlanActivitySection = ({ onUpgrade }: PlanActivitySectionProps) => {
  const { canGenerate, remainingQuota, totalQuota, plan, currentUsage, loading, error, refreshQuota } = useQuota();
  const userStats = useUserStats();

  // Calculate usage percentage for progress bar
  const usagePercentage = totalQuota > 0 ? (currentUsage / totalQuota) * 100 : 0;
  
  // Determine status and warning messages
  const getStatusInfo = () => {
    if (plan === 'pro' || plan === 'legend') {
      return {
        message: "Unlimited posts",
        color: "text-green-600",
        dotColor: "bg-green-500"
      };
    }
    
    if (remainingQuota === 0) {
      return {
        message: "Limit Reached",
        color: "text-red-600",
        dotColor: "bg-red-500"
      };
    }
    
    if (remainingQuota === 1) {
      return {
        message: "Almost at limit",
        color: "text-orange-600",
        dotColor: "bg-yellow-500"
      };
    }
    
    return {
      message: `${remainingQuota} posts remaining`,
      color: "text-green-600",
      dotColor: "bg-green-500"
    };
  };

  const statusInfo = getStatusInfo();
  const shouldShowUpgrade = plan === 'free' && remainingQuota <= 1;

  if (loading) {
    return (
      <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
        <CardHeader>
          <CardTitle className="font-heading text-midnight flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-neon" />
            <span>Your Plan & Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="h-4 bg-slate/20 rounded animate-pulse" />
            <div className="h-3 bg-slate/20 rounded animate-pulse" />
            <div className="h-6 bg-slate/20 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
        <CardHeader>
          <CardTitle className="font-heading text-midnight flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-neon" />
            <span>Your Plan & Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-4">
            <p className="text-slate text-sm mb-3">Failed to load quota information</p>
            <Button 
              onClick={refreshQuota}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              {plan === 'pro' || plan === 'legend' ? 'Unlimited' : `${currentUsage} of ${totalQuota}`}
            </span>
          </div>
          
          {plan !== 'pro' && plan !== 'legend' && (
            <Progress 
              value={usagePercentage} 
              className="h-3 bg-slate/20"
            />
          )}
          
          <p className={`text-xs ${statusInfo.color} font-medium`}>
            {statusInfo.message}
          </p>
        </div>

        {/* Plan Tier */}
        <div className="flex items-center justify-between p-3 bg-slate/5 rounded-lg">
          <div className="flex items-center space-x-2">
            <Crown className={`w-4 h-4 ${plan === 'pro' || plan === 'legend' ? 'text-neon' : 'text-slate'}`} />
            <span className="font-medium text-midnight">
              {plan === 'pro' ? 'Pro Plan' : plan === 'legend' ? 'Legend Plan' : 'Free Plan'}
            </span>
          </div>
          <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
        </div>

        {/* Upgrade CTA */}
        {shouldShowUpgrade && onUpgrade && (
          <Button 
            onClick={onUpgrade}
            className="w-full bg-neon text-midnight hover:bg-neon/90 font-semibold"
          >
            Upgrade to Pro
          </Button>
        )}

        {/* User Statistics */}
        <div className="space-y-4 pt-4 border-t border-slate/10">
          <h4 className="text-sm font-semibold text-midnight">Your Stats</h4>
          
          {userStats.loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-slate/20 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : userStats.error ? (
            <div className="text-center py-4">
              <p className="text-slate text-xs mb-2">{userStats.error}</p>
              <Button 
                onClick={userStats.refreshStats}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <StatCard 
                icon={<FileText className="w-4 h-4" />}
                label="Total Posts"
                value={userStats.totalPosts}
                subtitle="All time"
              />
              
              <StatCard 
                icon={<Calendar className="w-4 h-4" />}
                label="This Month"
                value={userStats.monthlyLimit === 'unlimited' 
                  ? `${userStats.monthlyUsage}/∞` 
                  : `${userStats.monthlyUsage}/${userStats.monthlyLimit}`
                }
                subtitle="Posts created"
              />
              
              <StatCard 
                icon={<Star className="w-4 h-4" />}
                label="Favorite Style"
                value={userStats.mostUsedTemplate}
                subtitle="Most used"
              />
              
              <StatCard 
                icon={<Clock className="w-4 h-4" />}
                label="Last Activity"
                value={userStats.lastActivity}
                subtitle="Recent post"
              />
              
              <StatCard 
                icon={<TrendingUp className="w-4 h-4" />}
                label="Avg. Length"
                value={`${userStats.averageLength} words`}
                subtitle="Typical post"
              />
              
              <StatCard 
                icon={<User className="w-4 h-4" />}
                label="Member Since"
                value={userStats.memberSince}
                subtitle="Account created"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
