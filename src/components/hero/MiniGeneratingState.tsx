
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface MiniGeneratingStateProps {
  step: number;
}

export const MiniGeneratingState = ({ step }: MiniGeneratingStateProps) => {
  return (
    <AnimatePresence mode="wait">
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          <button className="w-full bg-neon/80 text-midnight px-6 py-4 rounded-lg font-semibold text-base flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
