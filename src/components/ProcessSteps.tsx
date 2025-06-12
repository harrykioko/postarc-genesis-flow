import { ProcessStepsHeader } from "./processSteps/ProcessStepsHeader";
import { DesktopProcessSteps } from "./processSteps/desktop/DesktopProcessSteps";
import { MobileProcessSteps } from "./processSteps/mobile/MobileProcessSteps";
import { ProcessStepsCTA } from "./processSteps/ProcessStepsCTA";
import { useProcessSteps } from "./processSteps/hooks/useProcessSteps";
import { steps } from "./processSteps/data/processStepsData";
import { motion } from "framer-motion";

interface ProcessStepsProps {
  onTryNowClick: () => void;
}

export const ProcessSteps = ({ onTryNowClick }: ProcessStepsProps) => {
  const { activeStep, handleStepClick } = useProcessSteps();

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-12 md:py-16 overflow-hidden bg-gradient-to-b from-white to-[#F5FAFF]"
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <ProcessStepsHeader />

        <DesktopProcessSteps 
          steps={steps}
          activeStep={activeStep}
          onStepClick={handleStepClick}
        />

        <MobileProcessSteps steps={steps} />

        <ProcessStepsCTA onTryNowClick={onTryNowClick} />
      </div>
    </motion.section>
  );
};
