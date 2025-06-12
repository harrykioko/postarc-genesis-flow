import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface DemoCTAProps {
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

export const DemoCTA = ({ 
  variant = "secondary", 
  onClick, 
  className = "" 
}: DemoCTAProps) => {
  const isPrimary = variant === "primary";
  
  return (
    <motion.div 
      className={`text-center ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button 
        onClick={onClick}
        className={`
          relative overflow-hidden
          bg-gradient-to-r from-neon to-neon/90
          text-midnight hover:text-midnight
          font-semibold rounded-xl
          hover:shadow-2xl hover:shadow-neon/30
          transform transition-all duration-300
          group
          ${isPrimary ? "px-12 py-6 text-xl" : "px-8 py-4 text-lg"}
        `}
      >
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
        <span className="relative flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Start Free Demo
          <ArrowRight className={`ml-2 inline-block group-hover:translate-x-1 transition-transform ${
            isPrimary ? "w-5 h-5" : "w-4 h-4"
          }`} />
        </span>
      </Button>
      
      <p className={`text-slate mt-3 ${isPrimary ? "text-base" : "text-sm"}`}>
        {isPrimary 
          ? "No login required. 3 free posts. Instant results."
          : "No login required. 3 free posts."
        }
      </p>
    </motion.div>
  );
};
