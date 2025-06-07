
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WizardHeader } from "./wizard/WizardHeader";
import { WizardProgressBar } from "./wizard/WizardProgressBar";
import { WizardStepRenderer } from "./wizard/WizardStepRenderer";
import { WizardFooter } from "./wizard/WizardFooter";
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
          <WizardHeader
            stepTitle={getStepTitle()}
            onSaveAndExit={handleSaveAndExit}
            onClose={handleClose}
          />

          <WizardProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            completedSteps={completedSteps}
            canGoToStep={canGoToStep}
            goToStep={goToStep}
          />

          <div className="p-6">
            <WizardStepRenderer
              currentStep={currentStep}
              wizardData={wizardData}
              updateWizardData={updateWizardData}
              onTemplateCreated={handleTemplateCreated}
            />
          </div>

          <WizardFooter
            currentStep={currentStep}
            totalSteps={totalSteps}
            canProceed={canProceed()}
            onBack={handleBack}
            onNext={handleNext}
            onSkip={handleSkip}
            showSkip={currentStep === 4}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
