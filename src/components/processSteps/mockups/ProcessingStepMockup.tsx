
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const ProcessingStepMockup = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="py-12 text-center"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-20 h-20 mx-auto mb-6"
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-neon/20 rounded-full animate-ping"></div>
        <div className="relative w-full h-full bg-gradient-to-r from-neon to-mint rounded-full flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-midnight" />
        </div>
      </div>
    </motion.div>
    
    <div className="space-y-3">
      {["Analyzing context", "Applying frameworks", "Optimizing engagement"].map((text, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.3 }}
          className="flex items-center justify-center space-x-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: idx * 0.2 }}
            className="w-2 h-2 bg-neon rounded-full"
          />
          <span className="text-gray-600">{text}...</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);
