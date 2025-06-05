
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface DashboardHeaderProps {
  quota: { used: number; total: number };
  showPulse: boolean;
}

export const DashboardHeader = ({ quota, showPulse }: DashboardHeaderProps) => {
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
          <div className="relative">
            <Badge variant="outline" className="border-neon text-midnight">
              {quota.used}/{quota.total} posts used
            </Badge>
            {showPulse && (
              <div className="absolute inset-0 rounded-full border-2 border-neon animate-pulse-ring pointer-events-none" />
            )}
          </div>
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4 mr-2" />
            John Doe
          </Button>
        </div>
      </div>
    </header>
  );
};
