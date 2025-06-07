
import { CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkedInConnectedProfileProps {
  profile?: {
    name?: string;
    headline?: string;
    industry?: string;
    profile_image_url?: string;
    profile_url?: string;
  };
}

export const LinkedInConnectedProfile = ({ profile }: LinkedInConnectedProfileProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div className="flex items-center space-x-3">
          {profile?.profile_image_url && (
            <img 
              src={profile.profile_image_url} 
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
              {profile?.name || 'LinkedIn User'}
            </p>
            {profile?.headline && (
              <p className="text-sm text-green-600">{profile.headline}</p>
            )}
            {profile?.industry && (
              <p className="text-xs text-green-600">{profile.industry}</p>
            )}
          </div>
        </div>
      </div>
      {profile?.profile_url && (
        <Button
          variant="outline"
          size="sm"
          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          onClick={() => window.open(profile.profile_url, '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          View Profile
        </Button>
      )}
    </div>
  );
};
