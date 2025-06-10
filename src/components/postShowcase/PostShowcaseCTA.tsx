
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface PostShowcaseCTAProps {
  onTryNowClick?: () => void;
}

export const PostShowcaseCTA = ({ onTryNowClick }: PostShowcaseCTAProps) => {
  return (
    <div className="text-center">
      <motion.button
        onClick={onTryNowClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn-neon px-10 py-4 text-lg rounded-xl inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <Sparkles className="w-6 h-6" />
        Try It Free - No Card Required
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </motion.button>
      <p className="text-sm text-slate mt-3">
        Generate your first viral post in under 30 seconds
      </p>
    </div>
  );
};
