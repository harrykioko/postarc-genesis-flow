
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { DemoModal } from "./DemoModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleGetStartedClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth?intent=upgrade');
    }
  };

  const handleDemoClick = () => {
    setShowDemo(true);
  };

  const handlePricingClick = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignUpFromDemo = () => {
    setShowAuthModal(true);
  };

  const handlePricingFromDemo = () => {
    setShowDemo(false);
    handlePricingClick();
  };

  return (
    <>
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/4c54b1f5-c3f4-4d70-9a61-eca611f2e011.png" 
              alt="PostArc Logo" 
              className="h-8 w-auto object-contain"
            />
          </div>
          
          <nav className="flex items-center space-x-8">
            <button 
              onClick={handleDemoClick}
              className="text-slate hover:text-midnight transition-colors font-medium"
            >
              Demo
            </button>
            <button 
              onClick={handlePricingClick}
              className="text-slate hover:text-midnight transition-colors font-medium"
            >
              Pricing
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <Button
                  variant="ghost"
                  onClick={handleAuthClick}
                  className="text-slate hover:text-midnight"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleGetStartedClick}
                  className="btn-neon px-6 py-2 rounded-lg"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
        
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
        <DemoModal 
          open={showDemo} 
          onOpenChange={setShowDemo}
          onSignUpClick={handleSignUpFromDemo}
          onPricingClick={handlePricingFromDemo}
        />
      </header>
    </>
  );
};
