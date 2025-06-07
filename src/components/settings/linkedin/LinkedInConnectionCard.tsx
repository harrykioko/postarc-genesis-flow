
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { initiateLinkedInOAuth } from "@/utils/linkedinApi";
import { LinkedInFeatureList } from "./LinkedInFeatureList";
import { LinkedInConnectedProfile } from "./LinkedInConnectedProfile";
import { LinkedInConnectionActions } from "./LinkedInConnectionActions";
import { LinkedInConnectionStatus } from "./LinkedInConnectionStatus";

export const LinkedInConnectionCard = () => {
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
      await disconnectLinkedIn();
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
        <LinkedInFeatureList />
        
        <div className="space-y-4">
          <LinkedInConnectionStatus
            isConnected={linkedInConnected}
            isInOAuthFlow={isInOAuthFlow}
            linkedInOAuthInProgress={linkedInOAuthInProgress}
            onConnect={handleLinkedInConnect}
          />
          
          {linkedInConnected && (
            <>
              <LinkedInConnectedProfile profile={linkedInProfile} />
              <LinkedInConnectionActions
                isConnected={linkedInConnected}
                isDisconnecting={isDisconnecting}
                onDisconnect={handleLinkedInDisconnect}
                onReconnect={handleReconnect}
                onRefreshConnection={handleRefreshConnection}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
