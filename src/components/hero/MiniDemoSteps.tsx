
import { useState, useEffect } from 'react';

export interface UseMiniDemoStepsReturn {
  step: number;
  typedText: string;
  activeTemplate: number;
  showCursor: boolean;
}

export const useMiniDemoSteps = (): UseMiniDemoStepsReturn => {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [activeTemplate, setActiveTemplate] = useState(-1);
  const [showCursor, setShowCursor] = useState(true);

  const fullText = "How to use AI in healthcare...";

  // Main step progression
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 6);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Handle typing animation
  useEffect(() => {
    if (step === 0) {
      setTypedText('');
      setActiveTemplate(-1);
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 80);

      return () => clearInterval(typingInterval);
    }
  }, [step]);

  // Handle template highlighting
  useEffect(() => {
    if (step === 1) {
      let templateIndex = 0;
      const templateInterval = setInterval(() => {
        setActiveTemplate(templateIndex);
        templateIndex++;
        if (templateIndex >= 3) {
          clearInterval(templateInterval);
        }
      }, 300);

      return () => clearInterval(templateInterval);
    }
  }, [step]);

  // Handle cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return {
    step,
    typedText,
    activeTemplate,
    showCursor
  };
};
