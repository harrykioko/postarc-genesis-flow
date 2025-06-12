
import { motion } from "framer-motion";
import { Check, LucideIcon } from "lucide-react";

interface StepIndicatorProps {
  step: {
    id: number;
    icon: LucideIcon;
    title: string;
    stats: { time: string; action: string };
  };
  activeStep: number;
  onStepClick: (stepId: number) => void;
}

export const StepIndicator = ({ step, activeStep, onStepClick }: StepIndicatorProps) => (
  <button
    onClick={() => onStepClick(step.id)}
    className="group relative flex flex-col items-center"
  >
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative transition-all duration-300`}
    >
      {/* Outer ring animation for active step */}
      {activeStep === step.id && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.3, opacity: 0.3 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-neon rounded-full"
        />
      )}
      
      {/* Main circle */}
      <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
        activeStep === step.id 
          ? 'bg-neon border-neon shadow-lg shadow-neon/30' 
          : activeStep > step.id
          ? 'bg-neon/90 border-neon'
          : 'bg-white border-gray-300'
      }`}>
        <step.icon className={`w-9 h-9 transition-colors duration-300 ${
          activeStep >= step.id ? 'text-midnight' : 'text-gray-400'
        }`} />
      </div>
      
      {/* Step number badge */}
      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
        activeStep >= step.id
          ? 'bg-midnight text-white shadow-md'
          : 'bg-white border-2 border-gray-300 text-gray-600'
      }`}>
        {activeStep > step.id ? <Check className="w-4 h-4" /> : step.id}
      </div>
    </motion.div>
    
    {/* Step labels */}
    <div className="mt-4 text-center">
      <p className={`font-semibold text-sm transition-colors duration-300 ${
        activeStep === step.id ? 'text-midnight' : 'text-gray-600'
      }`}>
        {step.title}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">
        {step.stats.time} {step.stats.action}
      </p>
    </div>
  </button>
);
