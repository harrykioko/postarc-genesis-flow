
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Zap } from 'lucide-react';

interface ProgressiveEngagementProps {
  demoUsage: {
    used: number;
    limit: number;
    remaining: number;
  };
}

export const ProgressiveEngagement = ({ demoUsage }: ProgressiveEngagementProps) => {
  const { used, limit, remaining } = demoUsage;
  const progressPercentage = (used / limit) * 100;

  const getEngagementMessage = () => {
    if (used === 0) {
      return {
        icon: Zap,
        title: "Ready to create amazing content?",
        subtitle: "Generate your first professional LinkedIn post",
        urgency: false
      };
    } else if (used === 1) {
      return {
        icon: Zap,
        title: "Great start! 🚀",
        subtitle: "Try a different template to see the variety",
        urgency: false
      };
    } else if (used === 2) {
      return {
        icon: AlertCircle,
        title: "Last free post - make it count! ⚡",
        subtitle: "This is your final chance to experience the magic",
        urgency: true
      };
    } else {
      return {
        icon: Clock,
        title: "Demo complete! 🎉",
        subtitle: "See what unlimited access could do for you",
        urgency: true
      };
    }
  };

  const message = getEngagementMessage();
  const Icon = message.icon;

  return (
    <div className="space-y-4">
      {/* Progress Visualization */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-midnight">Demo Progress</span>
          <motion.div
            animate={remaining === 1 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: remaining === 1 ? Infinity : 0 }}
          >
            <Badge 
              variant={remaining > 1 ? "secondary" : remaining === 1 ? "destructive" : "outline"}
              className={`${remaining === 1 ? 'animate-pulse' : ''}`}
            >
              {remaining} tries remaining
            </Badge>
          </motion.div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full transition-colors duration-500 ${
              progressPercentage < 33 ? 'bg-green-500' :
              progressPercentage < 67 ? 'bg-yellow-500' :
              progressPercentage < 100 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate">
          {Array.from({ length: limit }, (_, i) => (
            <span 
              key={i} 
              className={`${i < used ? 'text-midnight font-medium' : ''}`}
            >
              Post {i + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Dynamic Engagement Message */}
      <motion.div
        key={used}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
          message.urgency 
            ? 'border-orange-300 bg-orange-50 shadow-lg shadow-orange-100' 
            : 'border-neon/30 bg-neon/5'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.urgency ? 'bg-orange-100' : 'bg-neon/20'
          }`}>
            <Icon className={`w-4 h-4 ${message.urgency ? 'text-orange-600' : 'text-neon'}`} />
          </div>
          
          <div className="flex-1">
            <h4 className={`font-semibold ${message.urgency ? 'text-orange-800' : 'text-midnight'}`}>
              {message.title}
            </h4>
            <p className={`text-sm ${message.urgency ? 'text-orange-600' : 'text-slate'}`}>
              {message.subtitle}
            </p>
          </div>
        </div>

        {/* Special effects for urgency */}
        {message.urgency && (
          <motion.div
            className="mt-2 text-xs text-orange-600 font-medium flex items-center space-x-1"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Clock className="w-3 h-3" />
            <span>Limited time - upgrade now for 2 bonus posts!</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
