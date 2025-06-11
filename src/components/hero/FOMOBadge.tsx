
import { useState, useEffect } from "react";
import { Gift } from "lucide-react";

interface FOMOBadgeProps {
  onOpenPricing: () => void;
}

export const FOMOBadge = ({ onOpenPricing }: FOMOBadgeProps) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onOpenPricing}
      className={`absolute top-4 right-4 bg-neon text-midnight px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-transform hover:scale-105 ${
        isPulsing ? "animate-pulse" : ""
      }`}
    >
      <Gift className="w-4 h-4" />
      <span className="hidden sm:inline">New users: First month 50% off Pro</span>
      <span className="sm:hidden">50% off Pro</span>
    </button>
  );
};
