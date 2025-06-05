
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthModal } from "./AuthModal";

export const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/517dc996-4525-45d7-8223-232c5844a386.png" 
            alt="PostArc Logo" 
            className="h-24 w-auto md:h-28"
          />
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
