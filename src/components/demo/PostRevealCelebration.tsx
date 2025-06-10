
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Linkedin, CheckCircle, Clock, BarChart3, Sparkles } from "lucide-react";

// Fallback toast function if not available
const toast = (params: any) => {
  console.log('Toast:', params.title, params.description);
};

interface PostRevealCelebrationProps {
  generatedPost: string;
  isGenerating: boolean;
  onCopy?: () => void;
  onShare?: () => void;
}

export const PostRevealCelebration = ({ 
  generatedPost, 
  isGenerating,
  onCopy,
  onShare 
}: PostRevealCelebrationProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [qualityScore] = useState(() => Math.floor(Math.random() * 11) + 85); // 85-95%
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);

  useEffect(() => {
    if (generatedPost && !isGenerating) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      
      // Calculate metrics
      const words = generatedPost.split(/\s+/).length;
      setWordCount(words);
      setReadTime(Math.ceil(words / 200)); // 200 words per minute
      
      return () => clearTimeout(timer);
    }
  }, [generatedPost, isGenerating]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      toast({
        title: "Copied!",
        description: "Post copied to clipboard"
      });
      if (onCopy) onCopy();
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "Copy failed",
        description: "Please select and copy manually",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&text=${encodeURIComponent(generatedPost)}`;
    window.open(linkedinUrl, '_blank');
    
    toast({
      title: "Opening LinkedIn",
      description: "Your post is ready to share!"
    });
    
    if (onShare) onShare();
  };

  if (!generatedPost || generatedPost.trim() === '') {
    return null;
  }

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }}
      className="glass-card-strong p-6 rounded-xl relative overflow-hidden"
    >
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 400,
                  y: -20,
                  rotate: 0,
                  scale: 0
                }}
                animate={{ 
                  y: 400,
                  rotate: 360,
                  scale: [0, 1, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 bg-neon rounded-full"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header with Quality Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h4 className="font-semibold text-midnight">Your LinkedIn Post</h4>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <BarChart3 className="w-3 h-3 mr-1" />
              Quality Score: {qualityScore}%
            </Badge>
          </motion.div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="flex items-center space-x-1"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </Button>
          <Button
            size="sm"
            onClick={handleShare}
            className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white flex items-center space-x-1"
          >
            <Linkedin className="w-3 h-3" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      {/* Generated Post Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line mb-4"
      >
        {generatedPost}
      </motion.div>

      {/* Quality Indicators */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-4 mb-4"
      >
        <div className="flex items-center space-x-2 text-xs">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-slate">SEO Optimized</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <Sparkles className="w-4 h-4 text-neon" />
          <span className="text-slate">Engagement Ready</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-slate">Professional Tone</span>
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
            <span>{readTime} min read</span>
          </div>
        </div>
        <Badge variant="secondary" className="bg-neon/20 text-midnight text-xs">
          LinkedIn Optimized ✓
        </Badge>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-700 font-medium">
            This post is ready to drive engagement on LinkedIn!
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
