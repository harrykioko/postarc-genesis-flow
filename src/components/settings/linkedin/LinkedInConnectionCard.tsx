
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LinkedInFeatureList } from "./LinkedInFeatureList";
import { LinkedInConnectedProfile } from "./LinkedInConnectedProfile";
import { LinkedInConnectionActions } from "./LinkedInConnectionActions";
import { LinkedInConnectionStatus } from "./LinkedInConnectionStatus";

export const LinkedInConnectionCard = () => {
  const { toast } = useToast();
  const { 
    linkedInConnected, 
    linkedInProfile, 
    disconnectLinkedIn, 
    checkLinkedInConnection 
  } = useAuth();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const checkConnectionStatus = async () => {
    try {
      await checkLinkedInConnection();
    } catch (error) {
      console.error('Status check error:', error);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const handleLinkedInConnect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError('');
    setSuccessMessage('');
    
    try {
      console.log('Initiating popup-based LinkedIn OAuth...');
      
      // Get the authorization URL from our edge function
      const { data, error } = await supabase.functions.invoke('linkedin-oauth-connect', {
        body: { action: 'initiate' }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to initiate LinkedIn OAuth');
      }

      if (!data.success || !data.auth_url) {
        throw new Error('Invalid response from LinkedIn OAuth service');
      }

      console.log('Opening LinkedIn OAuth popup...');
      
      // Open LinkedIn authorization in popup window
      const popup = window.open(
        data.auth_url,
        'linkedin-oauth',
        'width=500,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes'
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        throw new Error('Popup blocked. Please allow popups for this site and try again.');
      }

      // Monitor popup for completion
      const pollTimer = setInterval(() => {
        try {
          // Check if popup is closed (user cancelled or completed)
          if (popup.closed) {
            clearInterval(pollTimer);
            handleOAuthComplete();
            return;
          }
          
          // Try to check if popup navigated to callback URL
          try {
            if (popup.location && popup.location.href.includes('/connections/linkedin/callback')) {
              const url = new URL(popup.location.href);
              const code = url.searchParams.get('code');
              const state = url.searchParams.get('state');
              const authError = url.searchParams.get('error');
              
              clearInterval(pollTimer);
              popup.close();
              
              if (authError) {
                throw new Error(`LinkedIn OAuth error: ${authError}`);
              }
              
              if (code && state) {
                handleOAuthCallback(code, state);
              } else {
                throw new Error('Missing authorization code or state parameter');
              }
              return;
            }
          } catch (e) {
            // Cross-origin restrictions prevent reading popup.location
            // This is expected when popup is on different domain
            // We'll rely on popup.closed check and manual verification
          }
        } catch (e) {
          // Handle any unexpected errors in polling
          console.error('Popup polling error:', e);
        }
      }, 1000);
      
      // Timeout after 5 minutes
      setTimeout(() => {
        if (!popup.closed) {
          clearInterval(pollTimer);
          popup.close();
          setError('OAuth timeout. Please try again.');
          setIsConnecting(false);
        }
      }, 300000);
      
    } catch (error: any) {
      console.error('LinkedIn connection error:', error);
      setError(error.message || 'Failed to connect to LinkedIn. Please try again.');
      setIsConnecting(false);
    }
  };

  const handleOAuthCallback = async (code: string, state: string) => {
    try {
      console.log('Processing LinkedIn OAuth callback...');
      
      const { data, error } = await supabase.functions.invoke('linkedin-oauth-connect', {
        body: { 
          action: 'callback',
          code: code,
          state: state
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to process LinkedIn callback');
      }

      if (!data.success) {
        throw new Error(data.error || 'LinkedIn connection failed');
      }

      console.log('LinkedIn connection successful:', data.profile);
      
      // Update connection status
      await checkConnectionStatus();
      
      setSuccessMessage('LinkedIn connected successfully!');
      
      toast({
        title: "LinkedIn connected",
        description: "Your LinkedIn account has been connected successfully.",
      });
      
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      setError(`Failed to connect LinkedIn: ${error.message}`);
      
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to LinkedIn. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleOAuthComplete = async () => {
    // This runs when popup closes (user may have cancelled or completed)
    console.log('OAuth popup closed, checking connection status...');
    setIsConnecting(false);
    
    // Small delay to allow any background processing to complete
    setTimeout(async () => {
      await checkConnectionStatus();
      
      // If still not connected after popup closed, assume user cancelled
      if (!linkedInConnected && !error && !successMessage) {
        console.log('OAuth appears to have been cancelled by user');
      }
    }, 1000);
  };

  const handleLinkedInDisconnect = async () => {
    setIsDisconnecting(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const { error } = await disconnectLinkedIn();
      if (error) {
        throw new Error(error);
      }
      
      setSuccessMessage('LinkedIn disconnected successfully.');
      
      toast({
        title: "LinkedIn disconnected",
        description: "Your LinkedIn account has been disconnected.",
      });
    } catch (error: any) {
      console.error('Error disconnecting LinkedIn:', error);
      setError('Failed to disconnect LinkedIn. Please try again.');
      
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
      setError('Failed to reconnect LinkedIn. Please try again.');
    }
  };

  const handleRefreshConnection = async () => {
    try {
      await checkConnectionStatus();
      setSuccessMessage('Connection status refreshed.');
      
      toast({
        title: "Connection refreshed",
        description: "LinkedIn connection status has been updated.",
      });
    } catch (error) {
      setError('Failed to refresh connection status.');
      
      toast({
        title: "Refresh failed",
        description: "Failed to refresh connection status.",
        variant: "destructive"
      });
    }
  };

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
          {!linkedInConnected && !isConnecting && (
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              Not Connected
            </Badge>
          )}
          {isConnecting && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Connecting...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <LinkedInFeatureList />
        
        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
              <button 
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-green-800 text-sm">{successMessage}</p>
              </div>
              <button 
                onClick={() => setSuccessMessage('')}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Connection Status */}
          {!linkedInConnected && (
            <LinkedInConnectionStatus
              isConnected={linkedInConnected}
              isInOAuthFlow={isConnecting}
              linkedInOAuthInProgress={isConnecting}
              onConnect={handleLinkedInConnect}
            />
          )}
          
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
