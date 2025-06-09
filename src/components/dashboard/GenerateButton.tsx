
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onGenerate: () => void;
  disabled: boolean;
  isGenerating: boolean;
  showSpark: boolean;
}

export const GenerateButton = ({
  onGenerate,
  disabled,
  isGenerating,
  showSpark
}: GenerateButtonProps) => {
  return (
    <div className="relative">
      <Button
        onClick={onGenerate}
        disabled={disabled}
        className="h-12 bg-gradient-to-r from-neon to-mint text-midnight hover:from-neon/90 hover:to-mint/90 px-8 font-semibold transform hover:scale-105 active:scale-110 transition-all duration-200 shadow-lg"
        aria-label="Generate post content"
      >
        {isGenerating ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
            <span>Generating...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Generate</span>
          </div>
        )}
      </Button>
      
      {showSpark && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg animate-spark-float pointer-events-none">
          ✨
        </div>
      )}
    </div>
  );
};
