
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface PostsCreatedCounterProps {
  postsCreated: number;
}

export const PostsCreatedCounter = ({ postsCreated }: PostsCreatedCounterProps) => {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border border-neon/20"
      >
        <TrendingUp className="w-4 h-4 text-neon" />
        <motion.span
          key={postsCreated}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="font-bold text-neon text-lg"
        >
          {postsCreated}
        </motion.span>
        <span className="text-midnight font-medium">posts created today</span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </motion.div>
    </div>
  );
};
