
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useDemoState } from "@/hooks/useDemoState";
import { DemoInputSection } from "./demo/DemoInputSection";
import { EnhancedTemplateCards } from "./demo/EnhancedTemplateCards";
import { DemoGenerateButton } from "./demo/DemoGenerateButton";
import { AIGenerationAnimator } from "./demo/AIGenerationAnimator";
import { PostRevealCelebration } from "./demo/PostRevealCelebration";
import { ProgressiveEngagement } from "./demo/ProgressiveEngagement";
import { SocialProofTicker } from "./demo/SocialProofTicker";
import { DemoLimitReached } from "./demo/DemoLimitReached";
import { handleDemoGeneration } from "./demo/DemoGenerationLogic";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUpClick?: () => void;
  onPricingClick?: () => void;
}

export const DemoModal = ({ open, onOpenChange, onSignUpClick, onPricingClick }: DemoModalProps) => {
  const {
    input,
    setInput,
    selectedTemplate,
    setSelectedTemplate,
    isGenerating,
    setIsGenerating,
    generatedPost,
    setGeneratedPost,
    clearGeneratedPost,
    demoUsage,
    updateDemoUsage,
    getDemoSessionId,
  } = useDemoState(open);

  const handleGenerate = async () => {
    console.log('🎯 Generate button clicked');
    console.log('🎯 Current state before generation:', {
      input: input.substring(0, 50) + '...',
      selectedTemplate,
      isGenerating,
      generatedPost: generatedPost.length > 0 ? `${generatedPost.length} chars` : 'empty',
      demoUsage
    });

    await handleDemoGeneration(
      input,
      selectedTemplate,
      getDemoSessionId,
      demoUsage,
      setIsGenerating,
      setGeneratedPost,
      updateDemoUsage,
      clearGeneratedPost
    );
  };

  // Add defensive checks to prevent undefined errors
  const safeUsage = demoUsage || { used: 0, limit: 3, remaining: 3 };
  const canGenerate = safeUsage.remaining > 0;
  const isAtLimit = safeUsage.remaining === 0;

  console.log('🎭 Demo modal render state:', {
    open,
    generatedPostLength: generatedPost?.length || 0,
    isGenerating,
    usage: safeUsage,
    canGenerate,
    isAtLimit
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-heading">Experience PostArc Magic ✨</DialogTitle>
            <Badge variant="secondary" className="bg-neon/20 text-midnight">
              {safeUsage.remaining} tries remaining
            </Badge>
          </div>
        </DialogHeader>
        
        {/* Simplified Social Proof Section */}
        <div className="mb-6">
          <SocialProofTicker />
        </div>
        
        {/* Single Column Content Flow */}
        <div className="space-y-6">
          {/* Show AI Generation Animation when generating */}
          {isGenerating && (
            <AIGenerationAnimator isGenerating={isGenerating} />
          )}
          
          {/* Show Generated Post when available */}
          {generatedPost && !isGenerating && (
            <PostRevealCelebration
              generatedPost={generatedPost}
              isGenerating={isGenerating}
            />
          )}
          
          {/* Show Input Form when no post and not generating */}
          {!generatedPost && !isGenerating && (
            <>
              <DemoInputSection 
                input={input}
                onInputChange={setInput}
              />
              
              <EnhancedTemplateCards
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
              />
              
              <DemoGenerateButton
                input={input}
                isGenerating={isGenerating}
                canGenerate={canGenerate}
                remaining={safeUsage.remaining}
                onGenerate={handleGenerate}
              />
            </>
          )}
          
          {/* Progressive Engagement */}
          <ProgressiveEngagement demoUsage={safeUsage} />
          
          {/* Demo Limit Reached */}
          {isAtLimit && (
            <DemoLimitReached
              onClose={() => onOpenChange(false)}
              onPricingClick={onPricingClick}
              onSignUpClick={onSignUpClick}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
