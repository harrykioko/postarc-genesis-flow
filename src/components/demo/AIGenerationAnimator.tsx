
import { motion } from 'framer-motion';
import { Sparkles, Zap, Target } from 'lucide-react';

interface AIGenerationAnimatorProps {
  isGenerating: boolean;
}

const phases = [
  {
    icon: Target,
    text: "Analyzing your topic...",
    description: "Understanding context and audience",
    duration: 2000
  },
  {
    icon: Zap,
    text: "Crafting your post...",
    description: "Applying professional frameworks",
    duration: 2500
  },
  {
    icon: Sparkles,
    text: "Adding final touches...",
    description: "Optimizing for engagement",
    duration: 1500
  }
];

export const AIGenerationAnimator = ({ isGenerating }: AIGenerationAnimatorProps) => {
  if (!isGenerating) return null;

  return (
    <div className="glass-card p-8 rounded-xl text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-6"
      >
        {/* AI Brain Animation */}
        <div className="relative mx-auto w-20 h-20 bg-neon/20 rounded-full flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-10 h-10 bg-neon rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-midnight" />
          </motion.div>
          
          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-neon rounded-full"
              animate={{
                rotate: [0, 360],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{
                transformOrigin: "40px 0px",
                top: "50%",
                left: "50%"
              }}
            />
          ))}
        </div>

        {/* Phase Indicators */}
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: 1,
                scale: [1, 1.05, 1]
              }}
              transition={{
                delay: index * 2,
                duration: 0.5,
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-neon/20 rounded-full flex items-center justify-center">
                <phase.icon className="w-4 h-4 text-neon" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-midnight text-sm">
                  {phase.text}
                </div>
                <div className="text-xs text-slate">
                  {phase.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/30 rounded-full h-2">
          <motion.div
            className="bg-neon h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "easeInOut" }}
          />
        </div>

        {/* Floating Keywords */}
        <div className="relative h-12 overflow-hidden">
          {['professional', 'engaging', 'optimized', 'authentic'].map((word, index) => (
            <motion.div
              key={word}
              className="absolute inset-x-0 text-xs text-neon font-medium"
              initial={{ y: 50, opacity: 0 }}
              animate={{ 
                y: [-10, -30, -50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeOut"
              }}
            >
              {word}
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-slate">
          Our AI is crafting your perfect LinkedIn post...
        </p>
      </motion.div>
    </div>
  );
};
