
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Linkedin } from "lucide-react";

interface GeneratedPostProps {
  generatedPost: string;
  onCopy: (text: string) => void;
  onShare: () => void;
}

export const GeneratedPost = ({ generatedPost, onCopy, onShare }: GeneratedPostProps) => {
  if (!generatedPost) return null;

  return (
    <Card className="bg-white border-0 rounded-xl shadow-xl hover:ring-1 hover:ring-mint/10 transition-all duration-200 animate-slide-in-item">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-midnight">Generated Post</CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCopy(generatedPost)}
              className="flex items-center space-x-1 border-midnight hover:bg-mint hover:text-midnight"
              aria-label="Copy generated post"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </Button>
            <Button
              size="sm"
              onClick={onShare}
              className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white flex items-center space-x-1"
              aria-label="Share to LinkedIn"
            >
              <Linkedin className="w-3 h-3" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-slate/5 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line">
          {generatedPost}
        </div>
      </CardContent>
    </Card>
  );
};
