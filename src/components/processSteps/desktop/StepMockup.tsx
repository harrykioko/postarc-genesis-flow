
import { motion } from "framer-motion";
import { BrowserFrame } from "../shared/BrowserFrame";
import { InputStepMockup } from "../mockups/InputStepMockup";
import { ProcessingStepMockup } from "../mockups/ProcessingStepMockup";
import { ResultStepMockup } from "../mockups/ResultStepMockup";

interface StepMockupProps {
  activeStep: number;
}

export const StepMockup = ({ activeStep }: StepMockupProps) => (
  <motion.div
    key={activeStep}
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="relative"
  >
    <div className="relative">
      <BrowserFrame>
        {activeStep === 1 && <InputStepMockup />}
        {activeStep === 2 && <ProcessingStepMockup />}
        {activeStep === 3 && <ResultStepMockup />}
      </BrowserFrame>
      
      {/* Floating elements for visual interest */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -top-4 -right-4 w-20 h-20 bg-neon/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -bottom-4 -left-4 w-32 h-32 bg-mint/10 rounded-full blur-xl"
      />
    </div>
  </motion.div>
);
