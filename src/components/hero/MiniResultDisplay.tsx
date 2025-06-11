
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Copy, Share, BarChart3, Sparkles, Clock } from 'lucide-react';

interface MiniResultDisplayProps {
  step: number;
}

const mockPost = `🏥 AI is revolutionizing healthcare in ways we never imagined.

From diagnostic accuracy to personalized treatment plans, the potential is limitless.

What excites me most? The human connection remains irreplaceable.`;

export const MiniResultDisplay = ({ step }: MiniResultDisplayProps) => {
  const [qualityScore] = useState(() => Math.floor(Math.random() * 11) + 85);
  const [wordCount, setWordCount] = useState(0);

  // Calculate word count
  useEffect(() => {
    const words = mockPost.split(/\s+/).length;
    setWordCount(words);
  }, []);

  return (
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
  );
};
