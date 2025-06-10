import { Button } from "@/components/ui/button";
import { Copy, Linkedin, Sparkles, Loader2 } from "lucide-react";

// Fallback toast function if not available
const toast = (params: any) => {
  console.log('Toast:', params.title, params.description);
};

interface DemoGeneratedPostProps {
  generatedPost: string;
  demoUsageUsed: number;
  isGenerating?: boolean;
}

// This component is now deprecated in favor of PostRevealCelebration
// Keeping for backward compatibility but simplified
export const DemoGeneratedPost = ({ generatedPost, demoUsageUsed, isGenerating = false }: DemoGeneratedPostProps) => {
  console.log('📄 DemoGeneratedPost render (deprecated - use PostRevealCelebration):', {
    generatedPostLength: generatedPost?.length || 0,
    demoUsageUsed,
    isGenerating
  });

  // Show loading state during generation
  if (isGenerating) {
    return (
      <div className="glass-card p-8 rounded-xl text-center">
        <div className="w-16 h-16 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-neon animate-spin" />
        </div>
        <h4 className="font-semibold text-midnight mb-2">Generating your post...</h4>
        <p className="text-slate text-sm">This usually takes a few seconds</p>
      </div>
    );
  }

  // Show empty state when no post is generated
  if (!generatedPost || generatedPost.trim() === '') {
    return (
      <div className="glass-card p-8 rounded-xl text-center">
        <div className="w-16 h-16 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-neon" />
        </div>
        <h4 className="font-semibold text-midnight mb-2">Your generated post will appear here</h4>
        <p className="text-slate text-sm">Enter a topic or URL and click generate to see the magic happen</p>
      </div>
    );
  }

  // Simplified post display
  return (
    <div className="glass-card-strong p-6 rounded-xl">
      <div className="bg-white rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line">
        {generatedPost}
      </div>
    </div>
  );
};
