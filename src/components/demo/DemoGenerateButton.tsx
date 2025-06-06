
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle } from "lucide-react";

interface DemoGenerateButtonProps {
  input: string;
  isGenerating: boolean;
  canGenerate: boolean;
  remaining: number;
  onGenerate: () => void;
}

export const DemoGenerateButton = ({ 
  input, 
  isGenerating, 
  canGenerate, 
  remaining, 
  onGenerate 
}: DemoGenerateButtonProps) => {
  return (
    <Button
      onClick={onGenerate}
      disabled={!input.trim() || isGenerating || !canGenerate}
      className="w-full btn-neon py-3"
    >
      {isGenerating ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
          <span>Generating post...</span>
        </div>
      ) : !canGenerate ? (
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>Sign up for more</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>Generate Post ({remaining} left)</span>
        </div>
      )}
    </Button>
  );
};
