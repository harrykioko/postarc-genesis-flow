
import { Check } from "lucide-react";

export const ValueBullets = () => {
  const bullets = [
    "3 Free AI Posts",
    "5 Professional Templates", 
    "Copy & Share Instantly"
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
      {bullets.map((bullet, index) => (
        <div key={index} className="flex items-center gap-2">
          <Check className="w-5 h-5 text-neon" />
          <span className="text-slate font-medium">{bullet}</span>
        </div>
      ))}
    </div>
  );
};
