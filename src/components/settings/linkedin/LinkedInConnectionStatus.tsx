
import { Loader2, AlertCircle, Linkedin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkedInConnectionStatusProps {
  isConnected: boolean;
  isInOAuthFlow: boolean;
  linkedInOAuthInProgress: boolean;
  onConnect: () => void;
}

export const LinkedInConnectionStatus = ({
  isConnected,
  isInOAuthFlow,
  linkedInOAuthInProgress,
  onConnect
}: LinkedInConnectionStatusProps) => {
  if (isConnected) return null;

  if (isInOAuthFlow) {
    return (
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
    );
  }

  return (
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
        onClick={onConnect}
        disabled={isInOAuthFlow}
        className="w-full bg-[#0077B5] text-white hover:bg-[#0077B5]/90 flex items-center justify-center space-x-2"
      >
        <Linkedin className="w-4 h-4" />
        <span>Connect LinkedIn Account</span>
        <ExternalLink className="w-3 h-3" />
      </Button>
    </div>
  );
};
