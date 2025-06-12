
import { StepProgressBar } from "./StepProgressBar";
import { StepMockup } from "./StepMockup";
import { StepDescription } from "./StepDescription";

interface DesktopProcessStepsProps {
  steps: any[];
  activeStep: number;
  onStepClick: (stepId: number) => void;
}

export const DesktopProcessSteps = ({ steps, activeStep, onStepClick }: DesktopProcessStepsProps) => (
  <div className="hidden lg:block max-w-7xl mx-auto">
    <StepProgressBar 
      steps={steps}
      activeStep={activeStep}
      onStepClick={onStepClick}
    />

    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <StepMockup activeStep={activeStep} />
      <StepDescription 
        activeStep={activeStep}
        steps={steps}
        onStepClick={onStepClick}
      />
    </div>
  </div>
);
