
import { motion, AnimatePresence } from 'framer-motion';

interface MiniInputAndTemplatesProps {
  step: number;
  typedText: string;
  activeTemplate: number;
  showCursor: boolean;
}

const templates = [
  { id: 'consultant', name: 'Consultant', delay: 0 },
  { id: 'founder', name: 'Founder', delay: 0.3 },
  { id: 'vc', name: 'VC', delay: 0.6 }
];

export const MiniInputAndTemplates = ({ 
  step, 
  typedText, 
  activeTemplate, 
  showCursor 
}: MiniInputAndTemplatesProps) => {
  return (
    <AnimatePresence mode="wait">
      {(step === 0 || step === 1) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          {/* Mock Input Field */}
          <div className="relative">
            <div className="w-full px-4 py-3 bg-white/40 border border-white/50 rounded-lg text-base text-midnight">
              <span className="font-mono">
                {typedText}
                {step === 0 && showCursor && <span className="text-neon">|</span>}
              </span>
            </div>
          </div>

          {/* Template Pills */}
          <div className="flex gap-3">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  activeTemplate === index 
                    ? 'border-neon bg-neon/10 text-midnight' 
                    : 'border-white/30 bg-white/20 text-slate'
                }`}
                animate={activeTemplate === index ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {template.name}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
