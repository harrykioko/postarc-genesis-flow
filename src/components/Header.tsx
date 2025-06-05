
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/4c54b1f5-c3f4-4d70-9a61-eca611f2e011.png" 
            alt="PostArc Logo" 
            className="h-8 w-auto object-contain"
          />
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-slate hover:text-midnight transition-colors">Features</a>
          <a href="#pricing" className="text-slate hover:text-midnight transition-colors">Pricing</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          {!user && (
            <>
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
            </>
          )}
        </div>
      </div>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </header>
  );
};
