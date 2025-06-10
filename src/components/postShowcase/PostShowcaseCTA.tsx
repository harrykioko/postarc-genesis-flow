
import { motion } from 'framer-motion';

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
        className="btn-neon px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      >
        Try It Now
      </motion.button>
      <p className="text-sm text-slate mt-3">
        3 free posts • No signup required
      </p>
    </div>
  );
};
