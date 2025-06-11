
import { useState, useEffect } from "react";

export const DynamicCounter = () => {
  const [count, setCount] = useState(2419);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 4) + 2); // Increment by 2-5
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-slate mt-3 text-sm animate-fade-in">
      🔥 {count.toLocaleString()} people tried it in the last 24 hours
    </p>
  );
};
