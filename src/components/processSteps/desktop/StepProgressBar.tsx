
import { motion } from "framer-motion";
import { StepIndicator } from "./StepIndicator";

interface StepProgressBarProps {
  steps: any[];
  activeStep: number;
  onStepClick: (stepId: number) => void;
}

export const StepProgressBar = ({ steps, activeStep, onStepClick }: StepProgressBarProps) => (
  <div className="relative mb-16">
    {/* Progress Line */}
    <div className="absolute top-10 left-0 right-0 flex items-center">
      <div className="w-full h-0.5 bg-gray-200"></div>
    </div>
    <motion.div
      className="absolute top-10 left-0 h-0.5 bg-gradient-to-r from-neon to-mint"
      initial={{ width: "0%" }}
      animate={{ width: `${(activeStep / 3) * 100}%` }}
      transition={{ duration: 0.5 }}
    />
    
    {/* Step Indicators */}
    <div className="relative flex justify-between">
      {steps.map((step) => (
        <StepIndicator
          key={step.id}
          step={step}
          activeStep={activeStep}
          onStepClick={onStepClick}
        />
      ))}
    </div>
  </div>
);
