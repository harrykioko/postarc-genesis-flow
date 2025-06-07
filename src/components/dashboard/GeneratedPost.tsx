
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Linkedin, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { postToLinkedIn } from "@/utils/linkedinApi";

interface GeneratedPostProps {
  generatedPost: string;
  postId?: string;
  onCopy: (text: string) => void;
  onShare: () => void;
  linkedInPostingEnabled?: boolean;
}

export const GeneratedPost = ({ 
  generatedPost, 
  postId,
  onCopy, 
  onShare,
  linkedInPostingEnabled = false
}: GeneratedPostProps) => {
  const { toast } = useToast();
  const { linkedInConnected } = useAuth();
  const [isPostingToLinkedIn, setIsPostingToLinkedIn] = useState(false);
  const [linkedInPostUrl, setLinkedInPostUrl] = useState<string | null>(null);
  const [linkedInPostingError, setLinkedInPostingError] = useState<string | null>(null);

  if (!generatedPost) return null;

  const handlePostToLinkedIn = async () => {
    if (!linkedInConnected) {
      toast({
        title: "LinkedIn not connected",
        description: "Please connect your LinkedIn account in Account Settings to post directly.",
        variant: "destructive"
      });
      return;
    }

    if (!postId) {
      toast({
        title: "Post not saved",
        description: "Please generate the post first before posting to LinkedIn.",
        variant: "destructive"
      });
      return;
    }

    setIsPostingToLinkedIn(true);
    setLinkedInPostingError(null);

    try {
      const result = await postToLinkedIn(postId, generatedPost);
      
      if (result.success) {
        setLinkedInPostUrl(result.linkedin_post_url || null);
        toast({
          title: "Posted to LinkedIn! 🎉",
          description: "Your post has been successfully shared on LinkedIn."
        });
      } else {
        setLinkedInPostingError(result.error || "Failed to post to LinkedIn");
        toast({
          title: "Failed to post to LinkedIn",
          description: result.error || "Please try again or copy the text manually.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('LinkedIn posting error:', error);
      setLinkedInPostingError(error.message || "Failed to post to LinkedIn");
      toast({
        title: "Failed to post to LinkedIn",
        description: "Please try again or copy the text manually.",
        variant: "destructive"
      });
    } finally {
      setIsPostingToLinkedIn(false);
    }
  };

  const retryLinkedInPost = () => {
    setLinkedInPostingError(null);
    handlePostToLinkedIn();
  };

  return (
    <Card className="bg-white border-0 rounded-xl shadow-xl hover:ring-1 hover:ring-mint/10 transition-all duration-200 animate-slide-in-item">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-midnight">Generated Post</CardTitle>
          <div className="flex space-x-2">
            {/* LinkedIn Posting Button - Primary if enabled */}
            {linkedInPostingEnabled && linkedInConnected && !linkedInPostUrl && (
              <Button
                size="sm"
                onClick={isPostingToLinkedIn ? undefined : handlePostToLinkedIn}
                disabled={isPostingToLinkedIn}
                className="bg-mint hover:bg-mint/90 text-midnight flex items-center space-x-1 font-medium"
                aria-label="Post to LinkedIn"
              >
                <Linkedin className="w-3 h-3" />
                <span>
                  {isPostingToLinkedIn ? "Posting..." : "Post to LinkedIn"}
                </span>
              </Button>
            )}
            
            {/* Copy Button */}
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
            
            {/* Share Button */}
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
      <CardContent className="space-y-4">
        <div className="bg-slate/5 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line">
          {generatedPost}
        </div>
        
        {/* LinkedIn Post Status */}
        {linkedInPostingEnabled && linkedInConnected && (
          <div className="space-y-2">
            {/* Success State */}
            {linkedInPostUrl && (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Posted to LinkedIn ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(linkedInPostUrl, '_blank')}
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Post
                </Button>
              </div>
            )}
            
            {/* Error State */}
            {linkedInPostingError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">
                    Failed to post: {linkedInPostingError}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={retryLinkedInPost}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}
            
            {/* Loading State */}
            {isPostingToLinkedIn && (
              <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm text-blue-700">Posting to LinkedIn...</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
