
import { TemplateFoundationStep } from "./TemplateFoundationStep";
import { BusinessDetailsStep } from "./BusinessDetailsStep";
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
  onShowUpgrade?: () => void;
}

export const WizardStepRenderer = ({ 
  currentStep, 
  wizardData, 
  updateWizardData, 
  onTemplateCreated,
  onShowUpgrade
}: WizardStepRendererProps) => {
  const isBusinessRep = wizardData.foundation_type === "business_representative";

  // Handle step rendering based on foundation type
  if (!isBusinessRep) {
    // Original flow for non-business representatives
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
            onShowUpgrade={onShowUpgrade}
          />
        );
      default:
        return null;
    }
  } else {
    // Business representative flow with additional business details step
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
          <BusinessDetailsStep
            companyName={wizardData.company_name}
            companyDescription={wizardData.company_description}
            companyIndustry={wizardData.company_industry}
            companyGoals={wizardData.company_goals}
            targetAudience={wizardData.target_audience}
            onCompanyNameChange={(name) => updateWizardData("company_name", name)}
            onCompanyDescriptionChange={(description) => updateWizardData("company_description", description)}
            onCompanyIndustryChange={(industry) => updateWizardData("company_industry", industry)}
            onCompanyGoalsChange={(goals) => updateWizardData("company_goals", goals)}
            onTargetAudienceChange={(audience) => updateWizardData("target_audience", audience)}
          />
        );
      case 3:
        return (
          <TemplateToneStep
            selectedTones={wizardData.tone_attributes}
            onTonesChange={(tones) => updateWizardData("tone_attributes", tones)}
          />
        );
      case 4:
        return (
          <TemplateStructureStep
            selectedStructure={wizardData.structure_type}
            onStructureSelect={(structure) => updateWizardData("structure_type", structure)}
          />
        );
      case 5:
        return (
          <TemplateIndustryStep
            industryContext={wizardData.industry_context}
            onIndustryChange={(industry) => updateWizardData("industry_context", industry)}
          />
        );
      case 6:
        return (
          <TemplatePreviewStep
            wizardData={wizardData}
            onNameChange={(name) => updateWizardData("name", name)}
            onTemplateCreated={onTemplateCreated}
            onShowUpgrade={onShowUpgrade}
          />
        );
      default:
        return null;
    }
  }
};
