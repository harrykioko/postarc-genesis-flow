
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, ExternalLink, CheckCircle, AlertCircle, RefreshCw, Loader2, TrendingUp, User, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { initiateLinkedInOAuth } from "@/utils/linkedinApi";

export const LinkedInIntegration = () => {
  const { toast } = useToast();
  const { 
    linkedInConnected, 
    linkedInProfile, 
    linkedInOAuthInProgress,
    disconnectLinkedIn, 
    checkLinkedInConnection 
  } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleLinkedInConnect = async () => {
    if (isConnecting || linkedInOAuthInProgress) return;
    
    setIsConnecting(true);
    try {
      console.log('Initiating LinkedIn OAuth...');
      await initiateLinkedInOAuth();
      // Don't set isConnecting to false here - it will be handled by the OAuth callback
    } catch (error: any) {
      console.error('LinkedIn OAuth error:', error);
      setIsConnecting(false);
      
      let errorMessage = "Failed to connect to LinkedIn. Please try again.";
      if (error.message?.includes('popup')) {
        errorMessage = "Please allow popups for this site and try again.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Connection failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleLinkedInDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const { error } = await disconnectLinkedIn();
      if (error) {
        toast({
          title: "Disconnect failed",
          description: "Failed to disconnect LinkedIn. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "LinkedIn disconnected",
          description: "Your LinkedIn account has been disconnected.",
        });
      }
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      toast({
        title: "Disconnect failed",
        description: "Failed to disconnect LinkedIn. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleReconnect = async () => {
    try {
      // First disconnect, then reconnect
      await disconnectLinkedIn();
      // Small delay to ensure disconnect completes
      setTimeout(() => {
        handleLinkedInConnect();
      }, 500);
    } catch (error) {
      console.error('Error reconnecting LinkedIn:', error);
      toast({
        title: "Reconnection failed",
        description: "Failed to reconnect LinkedIn. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefreshConnection = async () => {
    try {
      await checkLinkedInConnection();
      toast({
        title: "Connection refreshed",
        description: "LinkedIn connection status has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh connection status.",
        variant: "destructive"
      });
    }
  };

  // Show connecting state during OAuth flow
  const isInOAuthFlow = isConnecting || linkedInOAuthInProgress;

  return (
    <Card className="bg-white border-slate/10 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-[#0077B5]/10 transition-all duration-200">
      <CardHeader>
        <CardTitle className="font-heading text-midnight flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Linkedin className="w-5 h-5 text-[#0077B5]" />
            <span>LinkedIn Professional</span>
          </div>
          {linkedInConnected && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
          {!linkedInConnected && !isInOAuthFlow && (
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              Not Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Feature Benefits */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#0077B5]" />
              <span className="text-sm text-midnight">Enable direct posting to LinkedIn</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-[#0077B5]" />
              <span className="text-sm text-midnight">Auto-populate profile information</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#0077B5]" />
              <span className="text-sm text-midnight">Access posting analytics</span>
              <Badge variant="outline" className="border-neon text-neon text-xs">Pro</Badge>
            </div>
          </div>
        </div>

        {!linkedInConnected ? (
          <div className="space-y-4">
            {isInOAuthFlow ? (
              <div className="flex items-center space-x-3 p-4 bg-[#0077B5]/5 border border-[#0077B5]/20 rounded-lg">
                <Loader2 className="w-5 h-5 text-[#0077B5] animate-spin" />
                <div>
                  <p className="font-semibold text-[#0077B5]">Connecting to LinkedIn...</p>
                  <p className="text-xs text-[#0077B5]/70">
                    {linkedInOAuthInProgress 
                      ? "Syncing your LinkedIn profile..." 
                      : "Please complete the authorization in the popup window"
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 text-sm font-medium mb-1">Connect your LinkedIn account</p>
                      <p className="text-gray-600 text-sm">
                        Link your LinkedIn profile to enable direct posting and automatically populate your professional information.
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleLinkedInConnect}
                  disabled={isInOAuthFlow}
                  className="w-full bg-[#0077B5] text-white hover:bg-[#0077B5]/90 flex items-center justify-center space-x-2"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Connect LinkedIn Account</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Connected User Info */}
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex items-center space-x-3">
                  {linkedInProfile?.profile_image_url && (
                    <img 
                      src={linkedInProfile.profile_image_url} 
                      alt="LinkedIn Profile" 
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <p className="font-semibold text-green-800">
                      {linkedInProfile?.name || 'LinkedIn User'}
                    </p>
                    {linkedInProfile?.headline && (
                      <p className="text-sm text-green-600">{linkedInProfile.headline}</p>
                    )}
                    {linkedInProfile?.industry && (
                      <p className="text-xs text-green-600">{linkedInProfile.industry}</p>
                    )}
                  </div>
                </div>
              </div>
              {linkedInProfile?.profile_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  onClick={() => window.open(linkedInProfile.profile_url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Profile
                </Button>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-midnight">Account Connected</p>
                <p className="text-xs text-slate">Direct LinkedIn posting is now enabled</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshConnection}
                  className="border-slate/30 text-slate hover:bg-slate/10"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReconnect}
                  className="border-[#0077B5]/30 text-[#0077B5] hover:bg-[#0077B5]/10"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reconnect
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLinkedInDisconnect}
                  disabled={isDisconnecting}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
