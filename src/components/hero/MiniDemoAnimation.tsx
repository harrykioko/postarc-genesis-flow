
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Copy, Share, Loader2 } from 'lucide-react';
import { MiniAIGenerationAnimator } from './MiniAIGenerationAnimator';

const templates = [
  { id: 'consultant', name: 'Consultant', delay: 0 },
  { id: 'founder', name: 'Founder', delay: 0.3 },
  { id: 'vc', name: 'VC', delay: 0.6 }
];

const mockPost = `🏥 AI is revolutionizing healthcare in ways we never imagined.

From diagnostic accuracy to personalized treatment plans, the potential is limitless.

What excites me most? The human connection remains irreplaceable.`;

export const MiniDemoAnimation = () => {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [activeTemplate, setActiveTemplate] = useState(-1);
  const [showCursor, setShowCursor] = useState(true);

  const fullText = "How to use AI in healthcare...";

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 7);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Handle typing animation
  useEffect(() => {
    if (step === 0) {
      setTypedText('');
      setActiveTemplate(-1);
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 80);

      return () => clearInterval(typingInterval);
    }
  }, [step]);

  // Handle template highlighting
  useEffect(() => {
    if (step === 1) {
      let templateIndex = 0;
      const templateInterval = setInterval(() => {
        setActiveTemplate(templateIndex);
        templateIndex++;
        if (templateIndex >= 3) {
          clearInterval(templateInterval);
        }
      }, 300);

      return () => clearInterval(templateInterval);
    }
  }, [step]);

  // Handle cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="hidden lg:block absolute top-1/2 right-8 -translate-y-1/2 w-full max-w-md z-20">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/20 backdrop-blur-glass border border-white/30 rounded-xl p-6 shadow-lg"
      >
        {/* Step 0-1: Input and Template Selection */}
        <AnimatePresence mode="wait">
          {(step === 0 || step === 1) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Mock Input Field */}
              <div className="relative">
                <div className="w-full px-3 py-2 bg-white/40 border border-white/50 rounded-lg text-sm text-midnight">
                  <span className="font-mono">
                    {typedText}
                    {step === 0 && showCursor && <span className="text-neon">|</span>}
                  </span>
                </div>
              </div>

              {/* Template Pills */}
              <div className="flex gap-2">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
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

        {/* Step 2: Generate Button */}
        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-sm text-slate mb-4">Ready to generate...</div>
              <motion.button
                className="w-full bg-neon text-midnight px-4 py-3 rounded-lg font-semibold text-sm"
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

        {/* Step 3: Generating State */}
        <AnimatePresence mode="wait">
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <button className="w-full bg-neon/80 text-midnight px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: AI Loading Animation */}
        <AnimatePresence mode="wait">
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MiniAIGenerationAnimator isGenerating={true} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 5: Result Preview */}
        <AnimatePresence mode="wait">
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-white/40 border border-white/50 rounded-lg p-4">
                <p className="text-xs text-midnight leading-relaxed whitespace-pre-line">
                  {mockPost}
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  className="flex-1 bg-white/30 text-midnight px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                  animate={{ 
                    boxShadow: [
                      "0 0 10px rgba(0, 255, 194, 0.2)",
                      "0 0 20px rgba(0, 255, 194, 0.4)",
                      "0 0 10px rgba(0, 255, 194, 0.2)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </motion.button>
                <motion.button
                  className="flex-1 bg-white/30 text-midnight px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                  animate={{ 
                    boxShadow: [
                      "0 0 10px rgba(0, 255, 194, 0.2)",
                      "0 0 20px rgba(0, 255, 194, 0.4)",
                      "0 0 10px rgba(0, 255, 194, 0.2)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Share className="w-3 h-3" />
                  Share
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 6: Success State */}
        <AnimatePresence mode="wait">
          {step === 6 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="flex justify-center"
              >
                <CheckCircle className="w-8 h-8 text-green-500" />
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-neon/20 text-midnight px-3 py-1 rounded-full text-xs font-semibold inline-block"
              >
                2 tries remaining
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
