
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useDemoState } from "@/hooks/useDemoState";
import { DemoInputSection } from "./demo/DemoInputSection";
import { DemoTemplateSelection } from "./demo/DemoTemplateSelection";
import { DemoGenerateButton } from "./demo/DemoGenerateButton";
import { DemoGeneratedPost } from "./demo/DemoGeneratedPost";
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
    demoUsage,
    updateDemoUsage,
    getDemoSessionId,
  } = useDemoState(open);

  const handleGenerate = () => {
    handleDemoGeneration(
      input,
      selectedTemplate,
      getDemoSessionId,
      demoUsage,
      setIsGenerating,
      setGeneratedPost,
      updateDemoUsage
    );
  };

  // Add defensive checks to prevent undefined errors
  const safeUsage = demoUsage || { used: 0, limit: 3, remaining: 3 };
  const canGenerate = safeUsage.remaining > 0;
  const isAtLimit = safeUsage.remaining === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-heading">Try PostArc Demo</DialogTitle>
            <Badge variant="secondary" className="bg-neon/20 text-midnight">
              {safeUsage.remaining} tries remaining
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <DemoInputSection 
              input={input}
              onInputChange={setInput}
            />
            
            <DemoTemplateSelection
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
            
            {isAtLimit && (
              <DemoLimitReached
                onClose={() => onOpenChange(false)}
                onPricingClick={onPricingClick}
                onSignUpClick={onSignUpClick}
              />
            )}
          </div>
          
          <div className="space-y-4">
            <DemoGeneratedPost
              generatedPost={generatedPost}
              demoUsageUsed={safeUsage.used}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
