
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export const SocialProofTicker = () => {
  const [postsCreated, setPostsCreated] = useState(247);

  useEffect(() => {
    // Simulate live counter
    const interval = setInterval(() => {
      setPostsCreated(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-4 bg-gradient-to-r from-neon/10 to-transparent rounded-lg border border-neon/20"
    >
      <div className="flex items-center justify-center space-x-2 mb-2">
        <TrendingUp className="w-4 h-4 text-neon" />
        <motion.span
          key={postsCreated}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="font-bold text-neon text-lg"
        >
          {postsCreated}
        </motion.span>
        <span className="text-midnight">posts created today</span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
      <p className="text-xs text-slate">
        Trusted by 1,000+ professionals from top companies
      </p>
    </motion.div>
  );
};
