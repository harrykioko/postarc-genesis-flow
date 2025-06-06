
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";

export const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  // Mock quota data - in real app this would come from user profile/usage
  const quotaUsed = 2;
  const quotaLimit = 5;
  const quotaPercentage = (quotaUsed / quotaLimit) * 100;

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/4c54b1f5-c3f4-4d70-9a61-eca611f2e011.png" 
                alt="PostArc Logo" 
                className="h-8 w-auto object-contain"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quota Display */}
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-slate">Posts:</span>
                <Badge 
                  variant="secondary" 
                  className={`${
                    quotaPercentage > 80 
                      ? 'bg-red-100 text-red-700 animate-pulse' 
                      : 'bg-neon/20 text-midnight'
                  }`}
                >
                  {quotaUsed}/{quotaLimit}
                </Badge>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate hidden sm:inline">
                  {user?.email}
                </span>
                
                {/* Settings Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-slate hover:text-midnight"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                {/* Sign Out Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-slate hover:text-midnight"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <AuthModal open={showSettings} onOpenChange={setShowSettings} defaultView="settings" />
    </>
  );
};
