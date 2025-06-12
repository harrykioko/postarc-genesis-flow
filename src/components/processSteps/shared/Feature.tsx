
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface FeatureProps {
  text: string;
}

export const Feature = ({ text }: FeatureProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-start space-x-3"
  >
    <div className="w-6 h-6 bg-neon/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
      <Check className="w-4 h-4 text-neon" />
    </div>
    <span className="text-gray-700">{text}</span>
  </motion.div>
);
