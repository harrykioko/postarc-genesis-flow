
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin, ExternalLink, CheckCircle, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
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
    <Card className="bg-white border-slate/10 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-neon/10 transition-all duration-200">
      <CardHeader>
        <CardTitle className="font-heading text-midnight flex items-center space-x-2">
          <Linkedin className="w-5 h-5" />
          <span>LinkedIn Integration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!linkedInConnected ? (
          <div className="space-y-4">
            {isInOAuthFlow ? (
              <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <p className="font-semibold text-blue-800">Connecting to LinkedIn...</p>
                  <p className="text-xs text-blue-600">
                    {linkedInOAuthInProgress 
                      ? "Syncing your LinkedIn profile..." 
                      : "Please complete the authorization in the popup window"
                    }
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-slate mt-0.5" />
                  <div>
                    <p className="text-slate text-sm">
                      Connect your LinkedIn account to enable direct posting and automatically populate your profile information.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleLinkedInConnect}
                  disabled={isInOAuthFlow}
                  className="bg-[#0077B5] text-white hover:bg-[#0077B5]/90 flex items-center space-x-2"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Connect LinkedIn Account</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    {linkedInProfile?.profile_image_url && (
                      <img 
                        src={linkedInProfile.profile_image_url} 
                        alt="LinkedIn Profile" 
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          // Hide image if it fails to load
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
                        <p className="text-xs text-green-600">{linkedInProfile.headline}</p>
                      )}
                      {linkedInProfile?.industry && (
                        <p className="text-xs text-green-600">{linkedInProfile.industry}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
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
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-midnight">Account Connected</p>
                <p className="text-xs text-slate">Enable direct LinkedIn posting in post generation</p>
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
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
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
