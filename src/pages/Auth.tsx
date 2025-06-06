
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(true);
  
  const intent = searchParams.get('intent');

  useEffect(() => {
    // If user is already authenticated, redirect immediately
    if (!loading && user) {
      if (intent === 'upgrade') {
        navigate('/dashboard?upgrade=true');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, intent, navigate]);

  // Don't render anything if user is already authenticated
  if (!loading && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-brand flex items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-midnight mb-4">
          {intent === 'upgrade' ? 'Join PostArc Pro' : 'Welcome to PostArc'}
        </h1>
        <p className="text-slate text-lg">
          {intent === 'upgrade' 
            ? 'Create your account to upgrade to our Pro plan' 
            : 'Create your account to start generating thought-leadership posts'
          }
        </p>
      </div>
      
      <AuthModal 
        open={showModal} 
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            navigate('/');
          }
        }} 
      />
    </div>
  );
};

export default Auth;
