
import { motion } from 'framer-motion';
import { activities } from './data/postShowcaseData';

interface ActivityTickerProps {
  currentActivity: number;
}

export const ActivityTicker = ({ currentActivity }: ActivityTickerProps) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <motion.span
          key={currentActivity}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="text-sm font-medium"
        >
          {activities[currentActivity]}
        </motion.span>
      </div>
    </div>
  );
};
