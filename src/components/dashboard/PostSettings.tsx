
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Linkedin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PostSettingsProps {
  useEmojis: boolean;
  setUseEmojis: (value: boolean) => void;
  useHashtags: boolean;
  setUseHashtags: (value: boolean) => void;
  postToLinkedIn: boolean;
  setPostToLinkedIn: (value: boolean) => void;
}

export const PostSettings = ({
  useEmojis,
  setUseEmojis,
  useHashtags,
  setUseHashtags,
  postToLinkedIn,
  setPostToLinkedIn
}: PostSettingsProps) => {
  const { linkedInConnected } = useAuth();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <Switch
            id="emojis"
            checked={useEmojis}
            onCheckedChange={setUseEmojis}
            className="data-[state=checked]:bg-mint"
            aria-label="Include emojis toggle"
          />
          <Label htmlFor="emojis">Include emojis</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="hashtags"
            checked={useHashtags}
            onCheckedChange={setUseHashtags}
            className="data-[state=checked]:bg-mint"
            aria-label="Include hashtags toggle"
          />
          <Label htmlFor="hashtags">Include hashtags</Label>
        </div>
      </div>
      
      {/* LinkedIn Posting Toggle */}
      <div className="pt-2 border-t border-slate/10">
        <div className="flex items-center space-x-2">
          <Switch
            id="linkedin-posting"
            checked={postToLinkedIn && linkedInConnected}
            onCheckedChange={(checked) => {
              if (linkedInConnected) {
                setPostToLinkedIn(checked);
                // Save preference to localStorage
                localStorage.setItem('postToLinkedIn', checked.toString());
              }
            }}
            disabled={!linkedInConnected}
            className="data-[state=checked]:bg-[#0077B5]"
            aria-label="Post to LinkedIn toggle"
          />
          <div className="flex items-center space-x-2">
            <Linkedin className="w-4 h-4 text-[#0077B5]" />
            <Label htmlFor="linkedin-posting" className="font-medium">
              Post directly to LinkedIn
            </Label>
          </div>
        </div>
        <p className="text-xs text-slate mt-1 ml-6">
          {linkedInConnected 
            ? (postToLinkedIn ? "Will post immediately after generation" : "Toggle to enable LinkedIn posting")
            : "Connect LinkedIn in Account Settings to enable"
          }
        </p>
      </div>
    </div>
  );
};
