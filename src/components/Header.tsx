
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthModal } from "./AuthModal";

export const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-midnight to-neon rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-2xl font-heading font-bold text-midnight">PostArc</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-slate hover:text-midnight transition-colors">Features</a>
          <a href="#pricing" className="text-slate hover:text-midnight transition-colors">Pricing</a>
          <a href="#demo" className="text-slate hover:text-midnight transition-colors">Demo</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setShowAuthModal(true)}
            className="text-slate hover:text-midnight"
          >
            Sign In
          </Button>
          <Button
            onClick={() => setShowAuthModal(true)}
            className="btn-neon px-6 py-2 rounded-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </header>
  );
};
