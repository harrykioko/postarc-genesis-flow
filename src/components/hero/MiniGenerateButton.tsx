
import { motion, AnimatePresence } from 'framer-motion';

interface MiniGenerateButtonProps {
  step: number;
}

export const MiniGenerateButton = ({ step }: MiniGenerateButtonProps) => {
  return (
    <AnimatePresence mode="wait">
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          <div className="text-base text-slate mb-6">Ready to generate...</div>
          <motion.button
            className="w-full bg-neon text-midnight px-6 py-4 rounded-lg font-semibold text-base"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(0, 255, 194, 0.3)",
                "0 0 40px rgba(0, 255, 194, 0.6)",
                "0 0 20px rgba(0, 255, 194, 0.3)"
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Generate Post
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
