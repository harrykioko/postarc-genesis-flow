
import { Button } from "@/components/ui/button";
import { Copy, Linkedin, Sparkles } from "lucide-react";

// Fallback toast function if not available
const toast = (params: any) => {
  console.log('Toast:', params.title, params.description);
};

interface DemoGeneratedPostProps {
  generatedPost: string;
  demoUsageUsed: number;
}

export const DemoGeneratedPost = ({ generatedPost, demoUsageUsed }: DemoGeneratedPostProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      toast({
        title: "Copied!",
        description: "Post copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy manually",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&text=${encodeURIComponent(generatedPost)}`;
    window.open(linkedinUrl, '_blank');
    
    // Track share action
    toast({
      title: "Opening LinkedIn",
      description: "Your post is ready to share!"
    });
  };

  if (!generatedPost) {
    return (
      <div className="glass-card p-8 rounded-xl text-center">
        <div className="w-16 h-16 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-neon" />
        </div>
        <h4 className="font-semibold text-midnight mb-2">Your generated post will appear here</h4>
        <p className="text-slate text-sm">Enter a topic or URL and click generate to see the magic happen</p>
        
        {demoUsageUsed > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              You've generated {demoUsageUsed} demo post{demoUsageUsed === 1 ? '' : 's'}!
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card-strong p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-midnight">Generated Post</h4>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="flex items-center space-x-1"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </Button>
          <Button
            size="sm"
            onClick={handleShare}
            className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white flex items-center space-x-1"
          >
            <Linkedin className="w-3 h-3" />
            <span>Share</span>
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line">
        {generatedPost}
      </div>
      
      {/* Encouraging message after generation */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-700 font-medium">
            This post is ready to share on LinkedIn!
          </span>
        </div>
      </div>
    </div>
  );
};
