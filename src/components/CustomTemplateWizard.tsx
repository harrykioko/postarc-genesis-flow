
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { TemplateFoundationStep } from "./wizard/TemplateFoundationStep";
import { TemplateToneStep } from "./wizard/TemplateToneStep";
import { TemplateStructureStep } from "./wizard/TemplateStructureStep";
import { TemplateIndustryStep } from "./wizard/TemplateIndustryStep";
import { TemplatePreviewStep } from "./wizard/TemplatePreviewStep";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<TemplateWizardData>({
    foundation_type: "",
    tone_attributes: [],
    structure_type: "",
    industry_context: "",
    name: ""
  });

  const totalSteps = 5;

  const updateWizardData = (field: keyof TemplateWizardData, value: any) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.foundation_type !== "";
      case 2:
        return wizardData.tone_attributes.length > 0;
      case 3:
        return wizardData.structure_type !== "";
      case 4:
        return true; // Industry context is optional
      case 5:
        return wizardData.name.trim() !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setWizardData({
      foundation_type: "",
      tone_attributes: [],
      structure_type: "",
      industry_context: "",
      name: ""
    });
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
            onTemplateCreated={() => {
              onTemplateCreated();
              handleClose();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 p-0">
        <div className="relative">
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate/10 p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold text-midnight">
                Create Custom Template
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-slate hover:text-midnight"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    i + 1 <= currentStep
                      ? 'bg-neon'
                      : 'bg-slate/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-slate mt-2">
              Step {currentStep} of {totalSteps}
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

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-neon text-midnight hover:bg-neon/90 flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
