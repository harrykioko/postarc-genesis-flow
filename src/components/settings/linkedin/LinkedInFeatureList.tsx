
import { Zap, User, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const LinkedInFeatureList = () => {
  return (
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
  );
};
