
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin, ExternalLink, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { initiateLinkedInOAuth } from "@/utils/linkedinApi";

export const LinkedInIntegration = () => {
  const { toast } = useToast();
  const { linkedInConnected, linkedInProfile, disconnectLinkedIn, checkLinkedInConnection } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const handleLinkedInConnect = async () => {
    setIsConnecting(true);
    try {
      await initiateLinkedInOAuth();
    } catch (error: any) {
      console.error('LinkedIn OAuth error:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to LinkedIn. Please try again.",
        variant: "destructive"
      });
      setIsConnecting(false);
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
    setIsReconnecting(true);
    try {
      // First disconnect, then reconnect
      await disconnectLinkedIn();
      setTimeout(() => {
        initiateLinkedInOAuth();
      }, 1000);
    } catch (error) {
      console.error('Error reconnecting LinkedIn:', error);
      toast({
        title: "Reconnection failed",
        description: "Failed to reconnect LinkedIn. Please try again.",
        variant: "destructive"
      });
      setIsReconnecting(false);
    }
  };

  const handleRefreshConnection = async () => {
    await checkLinkedInConnection();
    toast({
      title: "Connection refreshed",
      description: "LinkedIn connection status has been updated.",
    });
  };

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
              disabled={isConnecting}
              className="bg-[#0077B5] text-white hover:bg-[#0077B5]/90 flex items-center space-x-2"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Linkedin className="w-4 h-4" />
                  <span>Connect LinkedIn Account</span>
                  <ExternalLink className="w-3 h-3" />
                </>
              )}
            </Button>
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
                  onClick={isReconnecting ? undefined : handleReconnect}
                  disabled={isReconnecting}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {isReconnecting ? (
                    <>
                      <div className="w-3 h-3 border border-blue-600/30 border-t-blue-600 rounded-full animate-spin mr-1" />
                      Reconnecting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reconnect
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isDisconnecting ? undefined : handleLinkedInDisconnect}
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
