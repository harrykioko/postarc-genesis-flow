
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export const InputStepMockup = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-4"
  >
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        What's on your mind?
      </label>
      <div className="relative">
        <input
          type="text"
          value="AI in professional services"
          className="w-full px-4 py-3 border-2 border-neon/50 rounded-lg bg-neon/5 text-midnight font-medium"
          readOnly
        />
        <motion.div
          className="absolute right-3 top-3"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-5 h-5 text-neon" />
        </motion.div>
      </div>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Choose your voice
      </label>
      <div className="grid grid-cols-2 gap-2">
        {["Consultant", "Founder", "Sales", "VC"].map((voice, idx) => (
          <motion.div
            key={voice}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-3 rounded-lg border text-center text-sm font-medium ${
              idx === 0 
                ? "border-neon bg-neon/10 text-midnight shadow-md" 
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            {voice}
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);
