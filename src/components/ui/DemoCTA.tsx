
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <div className={`text-center ${className}`}>
      <Button 
        onClick={onClick}
        className={`bg-neon text-midnight hover:bg-neon/90 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 group ${
          isPrimary 
            ? "px-12 py-6 text-xl" 
            : "px-8 py-4 text-lg"
        }`}
      >
        Try It Now
        <ArrowRight className={`ml-2 inline-block group-hover:translate-x-1 transition-transform ${
          isPrimary ? "w-5 h-5" : "w-4 h-4"
        }`} />
      </Button>
      
      <p className={`text-slate mt-3 ${isPrimary ? "text-base" : "text-sm"}`}>
        {isPrimary 
          ? "3 free posts • No signup required • Takes 30 seconds"
          : "3 free posts • No signup required"
        }
      </p>
    </div>
  );
};
