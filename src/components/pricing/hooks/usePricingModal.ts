
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const usePricingModal = (onClose: () => void) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, session } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = async (tier: string) => {
    if (!user) {
      navigate(`/auth?intent=upgrade&tier=${tier}`);
      onClose();
      return;
    }

    // Check if we have a valid session
    if (!session?.access_token) {
      console.error('❌ No valid session found');
      toast({
        title: "Session expired",
        description: "Please sign in again to upgrade",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setLoading(tier);
    try {
      console.log(`🚀 Starting Stripe checkout for tier: ${tier}`);
      console.log('✅ Session valid:', !!session);
      console.log('👤 User ID:', user.id);
      console.log('📧 User email:', user.email);
      
      // Use the session-aware client with explicit auth header
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { tier },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      
      console.log('📦 Checkout response:', { data, error });
      
      if (error) {
        console.error("❌ Checkout error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      if (data?.url) {
        console.log("✅ Checkout session created, opening Stripe...");
        window.open(data.url, '_blank');
        onClose();
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error: any) {
      console.error('🚨 Upgrade error:', error);
      
      let errorMessage = "Failed to start checkout process. Please try again.";
      
      if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
        errorMessage = "Your session has expired. Please sign in again.";
        // Redirect to auth with upgrade intent
        setTimeout(() => {
          navigate(`/auth?intent=upgrade&tier=${tier}`);
        }, 2000);
      } else if (error.message?.includes('Authentication failed')) {
        errorMessage = "Authentication failed. Please sign in again.";
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
      
      toast({
        title: "Upgrade Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleFreeSignup = () => {
    if (!user) {
      navigate('/auth');
      onClose();
      return;
    }

    onClose();
  };

  return {
    loading,
    handleUpgrade,
    handleFreeSignup
  };
};
