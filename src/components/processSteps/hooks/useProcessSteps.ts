
import { useState, useEffect } from "react";

export const useProcessSteps = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance through steps
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 3) {
          setIsAutoPlaying(false);
          return 3;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Stop auto-play on user interaction
  const handleStepClick = (stepId: number) => {
    setIsAutoPlaying(false);
    setActiveStep(stepId);
  };

  return {
    activeStep,
    isAutoPlaying,
    handleStepClick
  };
};
