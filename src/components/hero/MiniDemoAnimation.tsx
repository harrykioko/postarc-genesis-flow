
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Copy, Share, Loader2, BarChart3, Sparkles, Clock } from 'lucide-react';
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
  const [qualityScore] = useState(() => Math.floor(Math.random() * 11) + 85);
  const [wordCount, setWordCount] = useState(0);

  const fullText = "How to use AI in healthcare...";

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 6); // Changed from 7 to 6 steps
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

  // Calculate word count
  useEffect(() => {
    const words = mockPost.split(/\s+/).length;
    setWordCount(words);
  }, []);

  // Handle cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/20 backdrop-blur-glass border border-white/30 rounded-xl p-8 shadow-lg"
      >
        {/* Step 0-1: Input and Template Selection */}
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

        {/* Step 2: Generate Button */}
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

        {/* Step 3: Generating State */}
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

        {/* Step 5: Enhanced Result with Quality Elements */}
        <AnimatePresence mode="wait">
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header with Quality Score */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-midnight text-lg">Your LinkedIn Post</h4>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                >
                  <BarChart3 className="w-3 h-3" />
                  Quality: {qualityScore}%
                </motion.div>
              </div>

              {/* Generated Post Content */}
              <div className="bg-white/40 border border-white/50 rounded-lg p-4">
                <p className="text-sm text-midnight leading-relaxed whitespace-pre-line">
                  {mockPost}
                </p>
              </div>

              {/* Quality Indicators */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-4 mb-4"
              >
                <div className="flex items-center space-x-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-slate">SEO Ready</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Sparkles className="w-4 h-4 text-neon" />
                  <span className="text-slate">Engaging</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-slate">Professional</span>
                </div>
              </motion.div>

              {/* Post Metrics */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between text-xs text-slate bg-white/30 rounded-lg p-3"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{wordCount}</span>
                    <span>words</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>1 min read</span>
                  </div>
                </div>
                <div className="bg-neon/20 text-midnight text-xs px-2 py-1 rounded-full font-medium">
                  LinkedIn Optimized ✓
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 bg-white/30 text-midnight px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                  animate={{ 
                    boxShadow: [
                      "0 0 10px rgba(0, 255, 194, 0.2)",
                      "0 0 20px rgba(0, 255, 194, 0.4)",
                      "0 0 10px rgba(0, 255, 194, 0.2)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </motion.button>
                <motion.button
                  className="flex-1 bg-white/30 text-midnight px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                  animate={{ 
                    boxShadow: [
                      "0 0 10px rgba(0, 255, 194, 0.2)",
                      "0 0 20px rgba(0, 255, 194, 0.4)",
                      "0 0 10px rgba(0, 255, 194, 0.2)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Share className="w-4 h-4" />
                  Share
                </motion.button>
              </div>

              {/* Success Message */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700 font-medium">
                    Ready to drive engagement on LinkedIn!
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
