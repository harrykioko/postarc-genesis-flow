
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  // Use the actual name from profile, fallback to parsed email if not available
  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';
  const initials = profile?.name 
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : displayName.slice(0, 2).toUpperCase();

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/4c54b1f5-c3f4-4d70-9a61-eca611f2e011.png" 
            alt="PostArc Logo" 
            className="h-8 w-auto object-contain"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-neon/10 text-midnight">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span>{displayName}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSettingsClick}
              aria-label="Account Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
