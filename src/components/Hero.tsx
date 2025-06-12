import { ChevronDown, Star, Sparkles } from "lucide-react";
import { useState } from "react";
import { DemoModal } from "./DemoModal";
import { AuthModal } from "./AuthModal";
import { PricingModal } from "./PricingModal";
import { motion } from "framer-motion";
import { HeroSamplePost } from "./hero/HeroSamplePost";

export const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const handleSignUpFromDemo = () => setShowAuth(true);
  const handlePricingFromDemo = () => {
    setShowDemo(false);
    setShowPricing(true);
  };
  const handleAuthFromPricing = () => setShowAuth(true);

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-12 md:pt-16 pb-16 md:pb-24">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-neon/5 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-midnight/5 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Main content wrapper */}
      <div className="flex-grow">
        <div className="container mx-auto px-6 max-w-screen-xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left column */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-xl mx-auto lg:mx-0">
              <h1 className="font-poppins font-extrabold text-[48px] md:text-[64px] leading-[1.1] tracking-tight">
                Feel stuck on LinkedIn?{" "}
                <span className="block bg-gradient-to-r from-purple-500 to-[#00FFC2] text-transparent bg-clip-text">
                  PostArc writes your post for you
                </span>
                in under 30 seconds.
              </h1>

              <p className="font-inter text-lg md:text-xl mt-4 text-slate-700 max-w-lg leading-relaxed">
                Turn your rough ideas into polished, high-performing LinkedIn posts — instantly. Grow your audience, stay consistent, and never miss a week again.
              </p>

              <button
                onClick={() => setShowDemo(true)}
                className="bg-[#00FFC2] text-black font-semibold text-lg px-6 py-3 rounded-full hover:shadow-lg transition mt-8"
              >
                ✨ Generate My First Post →
              </button>

              <div className="text-sm text-slate-500 mt-2">
                No signup. No credit card. 3 free posts.
              </div>

              <div className="text-sm text-slate-400 mt-4 flex flex-wrap gap-x-4 gap-y-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  4.9/5 from 50,000+ users
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  100,000+ posts generated
                </div>
              </div>
            </div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="flex justify-center items-center mt-8 lg:mt-0"
            >
              <HeroSamplePost />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mb-6 flex justify-center"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-slate">See how it works</span>
          <ChevronDown className="w-6 h-6 text-slate/30 animate-bounce" />
        </div>
      </motion.div>

      {/* Modals */}
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
