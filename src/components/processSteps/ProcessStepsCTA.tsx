
import { motion } from "framer-motion";
import { DemoCTA } from "../ui/DemoCTA";

interface ProcessStepsCTAProps {
  onTryNowClick: () => void;
}

export const ProcessStepsCTA = ({ onTryNowClick }: ProcessStepsCTAProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    viewport={{ once: true }}
    className="mt-16"
  >
    <DemoCTA onClick={onTryNowClick} />
  </motion.div>
);
