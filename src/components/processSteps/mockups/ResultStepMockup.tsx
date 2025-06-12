
import { motion } from "framer-motion";
import { Award } from "lucide-react";

export const ResultStepMockup = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", duration: 0.5 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-between mb-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center space-x-2"
      >
        <Award className="w-5 h-5 text-neon" />
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Quality Score: 91%
        </span>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex space-x-2"
      >
        <button className="px-4 py-2 bg-neon text-midnight rounded-lg font-medium text-sm hover:bg-neon/90">
          Copy
        </button>
        <button className="px-4 py-2 bg-midnight text-white rounded-lg font-medium text-sm hover:bg-midnight/90">
          Share
        </button>
      </motion.div>
    </div>
    
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-50 rounded-lg p-4"
    >
      <p className="text-gray-900 leading-relaxed">
        🚀 The AI revolution in professional services isn't coming—it's here.
        <br /><br />
        Forward-thinking firms are already leveraging AI to deliver 10x value 
        while others debate its potential.
        <br /><br />
        The question isn't IF you should adopt AI, but HOW FAST you can integrate 
        it into your practice.
        <br /><br />
        What's holding your firm back? 👇
      </p>
    </motion.div>
  </motion.div>
);
