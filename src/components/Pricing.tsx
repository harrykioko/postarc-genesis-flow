
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PricingCard } from "./pricing/PricingCard";
import { pricingTiers } from "./pricing/pricingData";

export const Pricing = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFreeSignup = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleUpgrade = (tier: string) => {
    if (user) {
      navigate(`/dashboard?upgrade=${tier}`);
    } else {
      navigate(`/auth?intent=upgrade&tier=${tier}`);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-white/50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            Start free and upgrade when you're ready to scale your thought leadership
          </p>
        </div>
        
        {/* Enhanced pricing grid with featured center card */}
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {pricingTiers.map((tier) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                onFreeSignup={handleFreeSignup}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mt-16">
          <p className="text-slate">
            All plans include our 30-day money-back guarantee. 
            <a href="mailto:support@postarc.ai" className="text-midnight hover:underline ml-1">Questions?</a>
          </p>
        </div>
      </div>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </section>
  );
};
