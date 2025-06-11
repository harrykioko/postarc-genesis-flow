
import { motion } from 'framer-motion';
import { MiniAIGenerationAnimator } from './MiniAIGenerationAnimator';
import { useMiniDemoSteps } from './MiniDemoSteps';
import { MiniInputAndTemplates } from './MiniInputAndTemplates';
import { MiniGenerateButton } from './MiniGenerateButton';
import { MiniGeneratingState } from './MiniGeneratingState';
import { MiniResultDisplay } from './MiniResultDisplay';

export const MiniDemoAnimation = () => {
  const { step, typedText, activeTemplate, showCursor } = useMiniDemoSteps();

  return (
    <div className="w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/20 backdrop-blur-glass border border-white/30 rounded-xl p-8 shadow-lg"
      >
        {/* Steps 0-1: Input and Template Selection */}
        <MiniInputAndTemplates
          step={step}
          typedText={typedText}
          activeTemplate={activeTemplate}
          showCursor={showCursor}
        />

        {/* Step 2: Generate Button */}
        <MiniGenerateButton step={step} />

        {/* Step 3: Generating State */}
        <MiniGeneratingState step={step} />

        {/* Step 4: AI Loading Animation */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MiniAIGenerationAnimator isGenerating={true} />
          </motion.div>
        )}

        {/* Step 5: Enhanced Result */}
        <MiniResultDisplay step={step} />
      </motion.div>
    </div>
  );
};
