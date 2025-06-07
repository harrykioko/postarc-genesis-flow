
import { TemplateFoundationStep } from "./TemplateFoundationStep";
import { TemplateToneStep } from "./TemplateToneStep";
import { TemplateStructureStep } from "./TemplateStructureStep";
import { TemplateIndustryStep } from "./TemplateIndustryStep";
import { TemplatePreviewStep } from "./TemplatePreviewStep";
import type { TemplateWizardData } from "../CustomTemplateWizard";

interface WizardStepRendererProps {
  currentStep: number;
  wizardData: TemplateWizardData;
  updateWizardData: (field: keyof TemplateWizardData, value: any) => void;
  onTemplateCreated: () => void;
}

export const WizardStepRenderer = ({ 
  currentStep, 
  wizardData, 
  updateWizardData, 
  onTemplateCreated 
}: WizardStepRendererProps) => {
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
          onTemplateCreated={onTemplateCreated}
        />
      );
    default:
      return null;
  }
};
