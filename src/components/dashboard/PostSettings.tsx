
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PostSettingsProps {
  useEmojis: boolean;
  setUseEmojis: (value: boolean) => void;
  useHashtags: boolean;
  setUseHashtags: (value: boolean) => void;
}

export const PostSettings = ({
  useEmojis,
  setUseEmojis,
  useHashtags,
  setUseHashtags
}: PostSettingsProps) => {
  return (
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
  );
};
