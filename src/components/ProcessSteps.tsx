
import { ProcessStepsHeader } from "./processSteps/ProcessStepsHeader";
import { DesktopProcessSteps } from "./processSteps/desktop/DesktopProcessSteps";
import { MobileProcessSteps } from "./processSteps/mobile/MobileProcessSteps";
import { ProcessStepsCTA } from "./processSteps/ProcessStepsCTA";
import { useProcessSteps } from "./processSteps/hooks/useProcessSteps";
import { steps } from "./processSteps/data/processStepsData";

interface ProcessStepsProps {
  onTryNowClick: () => void;
}

export const ProcessSteps = ({ onTryNowClick }: ProcessStepsProps) => {
  const { activeStep, handleStepClick } = useProcessSteps();

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <ProcessStepsHeader />

        <DesktopProcessSteps 
          steps={steps}
          activeStep={activeStep}
          onStepClick={handleStepClick}
        />

        <MobileProcessSteps steps={steps} />

        <ProcessStepsCTA onTryNowClick={onTryNowClick} />
      </div>
    </section>
  );
};
