
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

interface InteractiveDemoPreviewProps {
  onOpenDemo: () => void;
}

export const InteractiveDemoPreview = ({ onOpenDemo }: InteractiveDemoPreviewProps) => {
  const [input, setInput] = useState("");
  const [showSparkle, setShowSparkle] = useState(false);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.length > 0 && !showSparkle) {
      setShowSparkle(true);
    } else if (value.length === 0) {
      setShowSparkle(false);
    }
  };

  const handleInputClick = () => {
    onOpenDemo();
  };

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Input
          placeholder="Try it: 'AI trends in marketing' or paste any article URL..."
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onClick={handleInputClick}
          className="text-lg p-4 border-2 border-gray-200 focus:border-neon focus:shadow-[0_0_15px_rgba(0,255,194,0.2)] transition-all duration-200"
        />
        
        {showSparkle && (
          <div className="mt-3 flex items-center justify-center text-slate animate-fade-in">
            <Sparkles className="w-4 h-4 text-neon mr-2 animate-pulse" />
            <span>Press the button below to see the magic...</span>
          </div>
        )}
      </div>
    </div>
  );
};
