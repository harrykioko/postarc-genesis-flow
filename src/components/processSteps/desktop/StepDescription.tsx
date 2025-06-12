
import { motion } from "framer-motion";
import { Feature } from "../shared/Feature";
import { StepNavigation } from "./StepNavigation";
import { stepFeatures } from "../data/processStepsData";

interface StepDescriptionProps {
  activeStep: number;
  steps: any[];
  onStepClick: (stepId: number) => void;
}

export const StepDescription = ({ activeStep, steps, onStepClick }: StepDescriptionProps) => (
  <motion.div
    key={`desc-${activeStep}`}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-6"
  >
    <div>
      <div className="inline-flex items-center space-x-2 bg-neon/10 px-3 py-1 rounded-full mb-4">
        <span className="text-xs font-medium text-midnight">Step {activeStep} of 3</span>
      </div>
      
      <h3 className="text-3xl font-heading font-bold text-midnight mb-4">
        {steps[activeStep - 1].title}
      </h3>
      <p className="text-xl text-slate mb-6">
        {steps[activeStep - 1].description}
      </p>
    </div>

    <div className="space-y-4">
      {stepFeatures[activeStep as keyof typeof stepFeatures]?.map((feature, idx) => (
        <Feature key={idx} text={feature} />
      ))}
    </div>

    <StepNavigation 
      steps={steps}
      activeStep={activeStep}
      onStepClick={onStepClick}
    />
  </motion.div>
);
