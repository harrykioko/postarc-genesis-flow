
import { ChevronDown, Star } from "lucide-react";
import { useState } from "react";
import { DemoModal } from "./DemoModal";
import { AuthModal } from "./AuthModal";
import { PricingModal } from "./PricingModal";
import { DemoCTA } from "./ui/DemoCTA";
import { MiniDemoAnimation } from "./hero/MiniDemoAnimation";

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
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-neon/5 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-midnight/5 rounded-full blur-3xl" />
      </div>

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
        {/* Two-column layout on desktop, single column on mobile */}
        <div className="grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left column: Hero text content */}
          <div className="lg:text-left text-center">
            {/* Enhanced tagline */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-midnight leading-tight">
                <span className="block">Struggling to Post</span>
                <span className="block">on LinkedIn?</span>
                <span className="block">
                  Let AI turn your rough thoughts into{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-midnight via-purple-600 to-neon bg-clip-text text-transparent">
                      scroll-stopping content
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                      <path d="M1 5.5Q50 2 100 5.5T200 5.5" stroke="#00FFC2" strokeWidth="3" fill="none" className="animate-draw-line" />
                    </svg>
                  </span>
                  {" "}— in 30 seconds.
                </span>
              </h1>
            </div>

            {/* Value proposition */}
            <div className="text-xl md:text-2xl lg:text-3xl text-slate mb-12 font-body space-y-3">
              <p>
                Trained on 50,000 viral posts. Built for{" "}
                <span className="font-bold text-midnight">consultants, founders, and sales pros</span>.
              </p>
              <p className="text-lg md:text-xl lg:text-2xl">
                Try your first 3 posts free — no signup required.
              </p>
            </div>

            {/* Main CTA section */}
            <DemoCTA 
              variant="primary" 
              onClick={() => setShowDemo(true)} 
            />

            {/* Simple trust indicator */}
            <div className="mt-12 flex items-center lg:justify-start justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-slate ml-2">Trusted by 50,000+ professionals</span>
            </div>
          </div>

          {/* Right column: Mini Demo Animation (hidden on mobile) */}
          <div className="hidden lg:flex justify-center items-center">
            <MiniDemoAnimation />
          </div>
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
  );
};
