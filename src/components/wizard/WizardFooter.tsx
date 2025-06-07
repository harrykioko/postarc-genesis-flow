
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

export const WizardFooter = ({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  onBack, 
  onNext, 
  onSkip, 
  showSkip = false 
}: WizardFooterProps) => {
  return (
    <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-slate/10 p-6 z-10">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <div className="flex items-center space-x-3">
          {showSkip && onSkip && (
            <Button
              variant="outline"
              onClick={onSkip}
              className="text-slate"
            >
              Skip (Optional)
            </Button>
          )}
          
          {currentStep < totalSteps && (
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className="bg-neon text-midnight hover:bg-neon/90 flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
