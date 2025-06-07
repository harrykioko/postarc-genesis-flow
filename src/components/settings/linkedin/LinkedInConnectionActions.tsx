
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface LinkedInConnectionActionsProps {
  isConnected: boolean;
  isDisconnecting: boolean;
  onDisconnect: () => void;
  onReconnect: () => void;
  onRefreshConnection: () => void;
}

export const LinkedInConnectionActions = ({
  isConnected,
  isDisconnecting,
  onDisconnect,
  onReconnect,
  onRefreshConnection
}: LinkedInConnectionActionsProps) => {
  if (!isConnected) return null;

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div>
        <p className="text-sm font-medium text-midnight">Account Connected</p>
        <p className="text-xs text-slate">Direct LinkedIn posting is now enabled</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefreshConnection}
          className="border-slate/30 text-slate hover:bg-slate/10"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReconnect}
          className="border-[#0077B5]/30 text-[#0077B5] hover:bg-[#0077B5]/10"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Reconnect
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDisconnect}
          disabled={isDisconnecting}
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
        </Button>
      </div>
    </div>
  );
};
