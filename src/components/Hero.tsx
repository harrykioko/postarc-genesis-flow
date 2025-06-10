
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { DemoModal } from "./DemoModal";
import { AuthModal } from "./AuthModal";
import { PricingModal } from "./PricingModal";

export const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const handleSignUpFromDemo = () => {
    setShowAuth(true);
  };

  const handlePricingFromDemo = () => {
    setShowDemo(false);
    setShowPricing(true);
  };

  const handleAuthFromPricing = () => {
    setShowAuth(true);
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-neon/20 text-midnight border-neon/30">
            🚀 Generate LinkedIn posts in seconds
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Shape ideas.{" "}
            <span className="text-gradient">Share authority.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate mb-8 leading-relaxed max-w-3xl mx-auto">
            Generate expert-level posts in seconds with AI. Share confidently, grow your influence.
          </p>
          
          <div className="flex flex-col items-center mb-16">
            <button
              onClick={() => setShowDemo(true)}
              className="btn-neon px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Try It Now
            </button>
            <p className="text-sm text-slate mt-3">
              3 free posts • No signup required
            </p>
          </div>
        </div>
      </div>

      {/* Bounce Animation to Guide Users Down */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-8 bg-neon/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-neon/30">
          <ChevronDown className="w-4 h-4 text-neon" />
        </div>
      </div>
      
      <DemoModal 
        open={showDemo} 
        onOpenChange={setShowDemo}
        onSignUpClick={handleSignUpFromDemo}
        onPricingClick={handlePricingFromDemo}
      />
      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onAuthClick={handleAuthFromPricing}
        currentUsage={3}
        limit={3}
        resetDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
      />
    </section>
  );
};
