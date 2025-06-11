
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { DemoModal } from "./DemoModal";
import { AuthModal } from "./AuthModal";
import { PricingModal } from "./PricingModal";
import { DemoCTA } from "./ui/DemoCTA";
import { ActivityTicker } from "./hero/ActivityTicker";
import { FloatingTemplates } from "./hero/FloatingTemplates";
import { InteractiveDemoPreview } from "./hero/InteractiveDemoPreview";
import { ValueBullets } from "./hero/ValueBullets";
import { FOMOBadge } from "./hero/FOMOBadge";
import { DynamicCounter } from "./hero/DynamicCounter";

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
    <>
      {/* Activity Ticker */}
      <ActivityTicker />
      
      <section className="relative min-h-[90vh] flex items-center">
        {/* FOMO Badge */}
        <FOMOBadge onOpenPricing={() => setShowPricing(true)} />
        
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-neon/5 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-neon/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-midnight/5 rounded-full blur-3xl" />
        </div>

        {/* Floating Templates */}
        <FloatingTemplates />

        {/* Subtle floating elements */}
        <div className="absolute top-20 left-10 opacity-5 hidden lg:block">
          <div className="w-20 h-20 border-2 border-midnight rounded-full animate-pulse" />
        </div>
        <div className="absolute bottom-40 right-20 opacity-5 animate-pulse animation-delay-1000 hidden lg:block">
          <div className="w-32 h-32 border-2 border-neon rounded-full" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-5 animate-pulse animation-delay-2000 hidden lg:block">
          <div className="w-16 h-16 border-2 border-purple-600 rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Enhanced tagline */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-7xl font-heading font-bold text-midnight leading-tight">
                <span className="block">Watch AI Turn Your</span>
                <span className="block">
                  Rough Ideas Into{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-midnight via-purple-600 to-neon bg-clip-text text-transparent">
                      LinkedIn Gold
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                      <path d="M1 5.5Q50 2 100 5.5T200 5.5" stroke="#00FFC2" strokeWidth="3" fill="none" className="animate-draw-line" />
                    </svg>
                  </span>
                </span>
              </h1>
            </div>

            {/* Value proposition */}
            <p className="text-2xl md:text-3xl text-slate mb-12 max-w-3xl mx-auto font-body">
              Our AI analyzed 50,000 viral LinkedIn posts to help you write content that gets{" "}
              <span className="font-bold text-midnight">3x more engagement</span>.
            </p>

            {/* Interactive Demo Preview */}
            <InteractiveDemoPreview onOpenDemo={() => setShowDemo(true)} />

            {/* Main CTA section */}
            <div className="mb-8">
              <DemoCTA 
                variant="primary" 
                onClick={() => setShowDemo(true)} 
              />
              <DynamicCounter />
            </div>

            {/* Value Bullets */}
            <ValueBullets />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate/30" />
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
    </>
  );
};
