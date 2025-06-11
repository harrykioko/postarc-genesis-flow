
import { motion } from 'framer-motion';
import { Sparkles, Zap, Target } from 'lucide-react';

interface MiniAIGenerationAnimatorProps {
  isGenerating: boolean;
}

const phases = [
  {
    icon: Target,
    text: "Analyzing...",
    duration: 0.8
  },
  {
    icon: Zap,
    text: "Crafting...",
    duration: 1.0
  },
  {
    icon: Sparkles,
    text: "Optimizing...",
    duration: 0.7
  }
];

export const MiniAIGenerationAnimator = ({ isGenerating }: MiniAIGenerationAnimatorProps) => {
  if (!isGenerating) return null;

  return (
    <div className="bg-white/20 backdrop-blur-glass border border-white/30 rounded-lg p-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-3"
      >
        {/* Mini AI Brain Animation */}
        <div className="relative mx-auto w-12 h-12 bg-neon/20 rounded-full flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-6 h-6 bg-neon rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-3 h-3 text-midnight" />
          </motion.div>
          
          {/* Orbiting dots */}
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-neon rounded-full"
              animate={{
                rotate: [0, 360],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{
                transformOrigin: "24px 0px",
                top: "50%",
                left: "50%"
              }}
            />
          ))}
        </div>

        {/* Compact Phase Indicators */}
        <div className="space-y-2">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: 1,
                scale: [1, 1.05, 1]
              }}
              transition={{
                delay: index * 0.8,
                duration: 0.3,
                scale: {
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="flex items-center justify-center space-x-2"
            >
              <div className="w-5 h-5 bg-neon/20 rounded-full flex items-center justify-center">
                <phase.icon className="w-2.5 h-2.5 text-neon" />
              </div>
              <div className="text-xs font-medium text-midnight">
                {phase.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini Progress Bar */}
        <div className="w-full bg-white/30 rounded-full h-1.5">
          <motion.div
            className="bg-neon h-1.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>

        <p className="text-xs text-slate">
          AI crafting your post...
        </p>
      </motion.div>
    </div>
  );
};
