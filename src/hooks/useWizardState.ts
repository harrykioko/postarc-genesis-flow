
import { useState, useCallback, useEffect } from 'react';
import type { TemplateWizardData } from '@/components/CustomTemplateWizard';

const WIZARD_DRAFT_KEY = 'postArc_template_wizard_draft';

const getInitialWizardData = (): TemplateWizardData => ({
  foundation_type: "",
  company_name: "",
  company_description: "",
  company_industry: "",
  company_goals: "",
  target_audience: "",
  tone_attributes: [],
  structure_type: "",
  industry_context: "",
  name: ""
});

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1]));
  const [wizardData, setWizardData] = useState<TemplateWizardData>(getInitialWizardData());

  // Dynamic total steps based on foundation type
  const totalSteps = wizardData.foundation_type === "business_representative" ? 6 : 5;

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(WIZARD_DRAFT_KEY);
    if (savedDraft) {
      try {
        const { data, step, completed } = JSON.parse(savedDraft);
        // Ensure loaded data has all required properties with safe defaults
        const safeData: TemplateWizardData = {
          foundation_type: data?.foundation_type || "",
          company_name: data?.company_name || "",
          company_description: data?.company_description || "",
          company_industry: data?.company_industry || "",
          company_goals: data?.company_goals || "",
          target_audience: data?.target_audience || "",
          tone_attributes: Array.isArray(data?.tone_attributes) ? data.tone_attributes : [],
          structure_type: data?.structure_type || "",
          industry_context: data?.industry_context || "",
          name: data?.name || ""
        };
        setWizardData(safeData);
        setCurrentStep(step || 1);
        setCompletedSteps(new Set(Array.isArray(completed) ? completed : [1]));
      } catch (error) {
        console.error('Failed to load wizard draft:', error);
        // Reset to safe initial state on error
        setWizardData(getInitialWizardData());
      }
    }
  }, []);

  // Save draft to localStorage whenever state changes
  const saveDraft = useCallback(() => {
    const draft = {
      data: wizardData,
      step: currentStep,
      completed: Array.from(completedSteps)
    };
    localStorage.setItem(WIZARD_DRAFT_KEY, JSON.stringify(draft));
  }, [wizardData, currentStep, completedSteps]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(WIZARD_DRAFT_KEY);
  }, []);

  const updateWizardData = useCallback((field: keyof TemplateWizardData, value: any) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  }, []);

  const canProceed = useCallback(() => {
    // Add safe property access with null checks
    if (!wizardData) return false;
    
    const isBusinessRep = wizardData.foundation_type === "business_representative";
    
    switch (currentStep) {
      case 1: return Boolean(wizardData.foundation_type);
      case 2: 
        if (isBusinessRep) {
          // Business details step - require company name and description
          return Boolean(wizardData.company_name && wizardData.company_name.trim() && 
                        wizardData.company_description && wizardData.company_description.trim());
        } else {
          // Tone step for non-business reps
          return Array.isArray(wizardData.tone_attributes) && wizardData.tone_attributes.length > 0;
        }
      case 3:
        if (isBusinessRep) {
          // Tone step for business reps
          return Array.isArray(wizardData.tone_attributes) && wizardData.tone_attributes.length > 0;
        } else {
          // Structure step for non-business reps
          return Boolean(wizardData.structure_type);
        }
      case 4:
        if (isBusinessRep) {
          // Structure step for business reps
          return Boolean(wizardData.structure_type);
        } else {
          // Industry context step for non-business reps (optional)
          return true;
        }
      case 5:
        if (isBusinessRep) {
          // Industry context step for business reps (optional)
          return true;
        } else {
          // Preview step for non-business reps
          return Boolean(wizardData.name && wizardData.name.trim());
        }
      case 6:
        // Preview step for business reps
        return Boolean(wizardData.name && wizardData.name.trim());
      default: return false;
    }
  }, [currentStep, wizardData]);

  const canGoToStep = useCallback((step: number) => {
    return completedSteps.has(step) || step <= Math.max(...Array.from(completedSteps));
  }, [completedSteps]);

  const goToStep = useCallback((step: number) => {
    if (canGoToStep(step)) {
      setCurrentStep(step);
    }
  }, [canGoToStep]);

  const handleNext = useCallback(() => {
    if (canProceed() && currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setCompletedSteps(prev => new Set([...prev, nextStep]));
    }
  }, [canProceed, currentStep, totalSteps]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    const isBusinessRep = wizardData.foundation_type === "business_representative";
    const industryStep = isBusinessRep ? 5 : 4;
    
    if (currentStep === industryStep) { // Industry step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setCompletedSteps(prev => new Set([...prev, nextStep]));
    }
  }, [currentStep, wizardData.foundation_type]);

  return {
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
  };
};
