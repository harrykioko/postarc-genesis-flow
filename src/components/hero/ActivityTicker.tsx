
import { useEffect, useState } from "react";

const activities = [
  "🟢 Sarah from Microsoft just created a Founder post",
  "🟢 James from NYC generated a Sales post", 
  "🟢 Maria from Austin shared a Consultant post",
  "🟢 David from Tesla published a VC post",
  "🟢 Lisa from Google created a HR post"
];

export const ActivityTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-neon/10 to-mint/10 py-2 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Desktop: scrolling ticker */}
        <div className="hidden md:block">
          <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap">
            {activities.map((activity, index) => (
              <span key={index} className="text-sm text-slate mr-12">
                {activity}
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {activities.map((activity, index) => (
              <span key={`dup-${index}`} className="text-sm text-slate mr-12">
                {activity}
              </span>
            ))}
          </div>
        </div>
        
        {/* Mobile: one at a time */}
        <div className="md:hidden text-center">
          <span className="text-sm text-slate">
            {activities[currentIndex]}
          </span>
        </div>
      </div>
    </div>
  );
};
