
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
        className="bg-neon text-midnight hover:bg-neon/90 px-6 transform hover:scale-105 active:scale-110 transition-transform duration-100"
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
