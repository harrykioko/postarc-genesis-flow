import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  background?: "white" | "soft" | "gradient" | "glassy" | "glassy-gradient";
  withDivider?: boolean;
}

export const SectionTransition = ({ 
  children, 
  className = "", 
  background = "white",
  withDivider = true 
}: SectionTransitionProps) => {
  const backgrounds = {
    white: "bg-white",
    soft: "bg-gradient-to-b from-white to-[#f5faff]",
    gradient: "bg-gradient-to-b from-[#f5faff] to-white",
    glassy: "bg-white/40 backdrop-blur-lg border border-white/20",
    "glassy-gradient": "bg-gradient-to-b from-white/40 to-[#f5faff]/40 backdrop-blur-lg border border-white/20"
  };

  return (
    <section className={cn(
      "relative",
      backgrounds[background],
      className
    )}>
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pattern-dots" />
      
      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {children}
      </div>

      {/* Section divider */}
      {withDivider && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
      )}
    </section>
  );
}; 