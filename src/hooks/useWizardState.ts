
import { useState, useCallback, useEffect } from 'react';
import type { TemplateWizardData } from '@/components/CustomTemplateWizard';

const WIZARD_DRAFT_KEY = 'postArc_template_wizard_draft';

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1]));
  const [wizardData, setWizardData] = useState<TemplateWizardData>({
    foundation_type: "",
    tone_attributes: [],
    structure_type: "",
    industry_context: "",
    name: ""
  });

  const totalSteps = 5;

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(WIZARD_DRAFT_KEY);
    if (savedDraft) {
      try {
        const { data, step, completed } = JSON.parse(savedDraft);
        setWizardData(data);
        setCurrentStep(step);
        setCompletedSteps(new Set(completed));
      } catch (error) {
        console.error('Failed to load wizard draft:', error);
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
    switch (currentStep) {
      case 1: return wizardData.foundation_type !== "";
      case 2: return wizardData.tone_attributes.length > 0;
      case 3: return wizardData.structure_type !== "";
      case 4: return true; // Industry context is optional
      case 5: return wizardData.name.trim() !== "";
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
    if (currentStep === 4) { // Industry step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setCompletedSteps(prev => new Set([...prev, nextStep]));
    }
  }, [currentStep]);

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
