
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight, Save } from "lucide-react";
import { TemplateFoundationStep } from "./wizard/TemplateFoundationStep";
import { TemplateToneStep } from "./wizard/TemplateToneStep";
import { TemplateStructureStep } from "./wizard/TemplateStructureStep";
import { TemplateIndustryStep } from "./wizard/TemplateIndustryStep";
import { TemplatePreviewStep } from "./wizard/TemplatePreviewStep";
import { useWizardState } from "@/hooks/useWizardState";

interface CustomTemplateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: () => void;
}

export interface TemplateWizardData {
  foundation_type: string;
  tone_attributes: string[];
  structure_type: string;
  industry_context: string;
  name: string;
}

export const CustomTemplateWizard = ({ isOpen, onClose, onTemplateCreated }: CustomTemplateWizardProps) => {
  const {
    currentStep,
    completedSteps,
    wizardData,
    totalSteps,
    updateWizardData,
    canProceed,
    canGoToStep,
    goToStep,
    handleNext,
    handleBack,
    handleSkip,
    saveDraft,
    clearDraft
  } = useWizardState();

  const handleClose = () => {
    saveDraft();
    onClose();
  };

  const handleSaveAndExit = () => {
    saveDraft();
    onClose();
  };

  const handleTemplateCreated = () => {
    clearDraft();
    onTemplateCreated();
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateFoundationStep
            selectedFoundation={wizardData.foundation_type}
            onFoundationSelect={(foundation) => updateWizardData("foundation_type", foundation)}
          />
        );
      case 2:
        return (
          <TemplateToneStep
            selectedTones={wizardData.tone_attributes}
            onTonesChange={(tones) => updateWizardData("tone_attributes", tones)}
          />
        );
      case 3:
        return (
          <TemplateStructureStep
            selectedStructure={wizardData.structure_type}
            onStructureSelect={(structure) => updateWizardData("structure_type", structure)}
          />
        );
      case 4:
        return (
          <TemplateIndustryStep
            industryContext={wizardData.industry_context}
            onIndustryChange={(industry) => updateWizardData("industry_context", industry)}
          />
        );
      case 5:
        return (
          <TemplatePreviewStep
            wizardData={wizardData}
            onNameChange={(name) => updateWizardData("name", name)}
            onTemplateCreated={handleTemplateCreated}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = [
      "",
      "Choose Foundation",
      "Select Tone",
      "Pick Structure", 
      "Add Industry Context",
      "Preview & Save"
    ];
    return titles[currentStep] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 p-0">
        <div className="relative">
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate/10 p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-heading font-bold text-midnight">
                  Create Custom Template
                </h2>
                <p className="text-slate mt-1">{getStepTitle()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAndExit}
                  className="flex items-center space-x-1"
                >
                  <Save className="w-3 h-3" />
                  <span>Save & Exit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="text-slate hover:text-midnight"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Clickable Progress indicator */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => {
                const stepNumber = i + 1;
                const isCompleted = completedSteps.has(stepNumber);
                const isCurrent = stepNumber === currentStep;
                const isClickable = canGoToStep(stepNumber);
                
                return (
                  <div
                    key={i}
                    onClick={() => isClickable ? goToStep(stepNumber) : undefined}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'bg-neon ring-2 ring-neon/30'
                        : isCompleted
                        ? 'bg-mint'
                        : 'bg-slate/20'
                    } ${isClickable ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                  />
                );
              })}
            </div>
            <p className="text-sm text-slate mt-2">
              Step {currentStep} of {totalSteps}
              {currentStep > 1 && " • Click steps to navigate"}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {renderStep()}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-slate/10 p-6 z-10">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <div className="flex items-center space-x-3">
                {currentStep === 4 && (
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="text-slate"
                  >
                    Skip (Optional)
                  </Button>
                )}
                
                {currentStep < totalSteps && (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-neon text-midnight hover:bg-neon/90 flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
