
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkLinkedInConnectionStatus, disconnectLinkedIn } from '@/utils/linkedinApi';
import type { LinkedInProfile } from '@/utils/linkedinApi';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ error?: any }>;
  linkedInConnected: boolean;
  linkedInProfile: LinkedInProfile | null;
  linkedInOAuthInProgress: boolean;
  checkLinkedInConnection: () => Promise<void>;
  disconnectLinkedIn: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [linkedInOAuthInProgress, setLinkedInOAuthInProgress] = useState(false);
  const [hasProcessedSignIn, setHasProcessedSignIn] = useState(false);

  const signInWithMagicLink = async (email: string) => {
    try {
      // Redirect to dashboard after magic link authentication
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      console.log('Sending magic link with redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      return { error };
    } catch (error: any) {
      console.error('Magic link error:', error);
      return { error };
    }
  };

  const checkLinkedInConnection = async () => {
    if (!user) return;

    try {
      console.log('Checking LinkedIn connection status...');
      const status = await checkLinkedInConnectionStatus();
      
      if (status.success) {
        const isConnected = status.connection_status === 'connected';
        setLinkedInConnected(isConnected);
        setLinkedInProfile(isConnected ? status.profile || null : null);
        
        console.log('LinkedIn connection status:', {
          connected: isConnected,
          profile: status.profile
        });
      } else {
        console.log('LinkedIn connection check failed:', status.error);
        setLinkedInConnected(false);
        setLinkedInProfile(null);
      }
    } catch (error) {
      console.error('Error checking LinkedIn connection:', error);
      setLinkedInConnected(false);
      setLinkedInProfile(null);
    }
  };

  const handleDisconnectLinkedIn = async () => {
    try {
      const result = await disconnectLinkedIn();
      if (!result.error) {
        setLinkedInConnected(false);
        setLinkedInProfile(null);
        console.log('LinkedIn disconnected successfully');
      }
      return result;
    } catch (error: any) {
      console.error('Error disconnecting LinkedIn:', error);
      return { error: error.message };
    }
  };

  const handleAuthStateChange = (event: string, session: Session | null) => {
    console.log('Auth state changed:', { 
      event, 
      userEmail: session?.user?.email, 
      currentPath: window.location.pathname,
      hasProcessedSignIn 
    });
    
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);

    // Handle dashboard redirect for sign in events
    if (session?.user && event === 'SIGNED_IN' && !hasProcessedSignIn) {
      setHasProcessedSignIn(true);
      
      console.log('Processing SIGNED_IN event, current path:', window.location.pathname);
      
      // Use setTimeout to ensure the auth state is fully updated
      setTimeout(() => {
        if (window.location.pathname === '/') {
          console.log('Redirecting from landing page to dashboard');
          window.location.href = '/dashboard';
        } else {
          console.log('User signed in but not on landing page, staying on:', window.location.pathname);
        }
      }, 100);
    }

    // Reset the flag when user signs out
    if (!session?.user) {
      setHasProcessedSignIn(false);
      setLinkedInConnected(false);
      setLinkedInProfile(null);
    }

    // Check LinkedIn connection after successful sign in
    if (session?.user && event === 'SIGNED_IN') {
      setTimeout(() => {
        checkLinkedInConnection();
      }, 1000);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', { 
        userEmail: session?.user?.email, 
        currentPath: window.location.pathname 
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Check LinkedIn connection if user is already authenticated
      if (session?.user) {
        setTimeout(() => {
          checkLinkedInConnection();
        }, 500);
      }
    });

    return () => {
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  // Fallback check - if user is authenticated but still on landing page after a delay
  useEffect(() => {
    if (!loading && user && window.location.pathname === '/') {
      console.log('Fallback check: authenticated user on landing page');
      
      const fallbackTimer = setTimeout(() => {
        if (window.location.pathname === '/') {
          console.log('Fallback redirect to dashboard');
          window.location.href = '/dashboard';
        }
      }, 2000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [loading, user]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    // Clear LinkedIn state on sign out
    setLinkedInConnected(false);
    setLinkedInProfile(null);
    setHasProcessedSignIn(false);
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    signInWithMagicLink,
    linkedInConnected,
    linkedInProfile,
    linkedInOAuthInProgress,
    checkLinkedInConnection,
    disconnectLinkedIn: handleDisconnectLinkedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
