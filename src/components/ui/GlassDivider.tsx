import React from "react";
import { cn } from "@/lib/utils";

interface GlassDividerProps {
  position?: "top" | "bottom";
  className?: string;
}

/**
 * GlassDivider
 * Curved, frosted glass SVG divider for section transitions.
 * @param position - "top" or "bottom" (default: "bottom")
 * @param className - Additional Tailwind classes
 */
export const GlassDivider: React.FC<GlassDividerProps> = ({
  position = "bottom",
  className = "",
}) => (
  <div
    className={cn(
      "relative w-full overflow-hidden",
      position === "top" ? "rotate-180" : "",
      className
    )}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-24"
    >
      <defs>
        <filter id="shadow" x="0" y="0" width="200%" height="200%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#00FFC2" floodOpacity="0.15"/>
        </filter>
      </defs>
      <path
        d="M0,0 C480,120 960,0 1440,120 L1440,120 L0,120 Z"
        fill="white"
        fillOpacity="0.7"
        filter="url(#shadow)"
        style={{ filter: "blur(12px)" }}
      />
      <path
        d="M0,0 C480,120 960,0 1440,120"
        stroke="#00FFC2"
        strokeOpacity="0.5"
        strokeWidth="6"
        filter="url(#shadow)"
      />
    </svg>
    <div className="absolute inset-0 bg-white/30 backdrop-blur-lg pointer-events-none" />
  </div>
); 