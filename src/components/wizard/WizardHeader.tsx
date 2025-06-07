
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";

interface WizardHeaderProps {
  stepTitle: string;
  onSaveAndExit: () => void;
  onClose: () => void;
}

export const WizardHeader = ({ stepTitle, onSaveAndExit, onClose }: WizardHeaderProps) => {
  return (
    <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate/10 p-6 z-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-midnight">
            Create Custom Template
          </h2>
          <p className="text-slate mt-1">{stepTitle}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveAndExit}
            className="flex items-center space-x-1"
          >
            <Save className="w-3 h-3" />
            <span>Save & Exit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate hover:text-midnight"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
