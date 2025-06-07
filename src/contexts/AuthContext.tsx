
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkLinkedInConnectionStatus, disconnectLinkedIn as apiDisconnectLinkedIn } from '@/utils/linkedinApi';

interface LinkedInProfile {
  member_id: string;
  profile_url: string;
  profile_image_url: string;
  name: string;
  headline?: string;
  industry?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  linkedInConnected: boolean;
  linkedInProfile: LinkedInProfile | null;
  linkedInOAuthInProgress: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkLinkedInConnection: () => Promise<boolean>;
  disconnectLinkedIn: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [linkedInOAuthInProgress, setLinkedInOAuthInProgress] = useState(false);

  const checkLinkedInConnection = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const status = await checkLinkedInConnectionStatus();
      
      if (!status.success || status.connection_status !== 'connected') {
        setLinkedInConnected(false);
        setLinkedInProfile(null);
        return false;
      }

      setLinkedInConnected(true);
      if (status.profile) {
        setLinkedInProfile({
          member_id: status.profile.linkedin_member_id,
          profile_url: status.profile.profile_url,
          profile_image_url: status.profile.profile_image_url || '',
          name: status.profile.name,
        });
      }
      return true;
    } catch (error) {
      console.error('Error checking LinkedIn connection:', error);
      setLinkedInConnected(false);
      setLinkedInProfile(null);
      return false;
    }
  };

  const disconnectLinkedIn = async () => {
    try {
      const result = await apiDisconnectLinkedIn();
      if (result.success) {
        setLinkedInConnected(false);
        setLinkedInProfile(null);
        return { error: null };
      }
      return { error: result.error };
    } catch (error: any) {
      console.error('Error disconnecting LinkedIn:', error);
      return { error: error.message };
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check LinkedIn connection for authenticated users
        if (session?.user) {
          setTimeout(() => {
            checkLinkedInConnection();
          }, 100);
        }
        
        // Clear LinkedIn state when user signs out
        if (event === 'SIGNED_OUT') {
          setLinkedInConnected(false);
          setLinkedInProfile(null);
          setLinkedInOAuthInProgress(false);
        }
        
        // Handle redirect after successful authentication
        if (event === 'SIGNED_IN' && session?.user) {
          const currentPath = window.location.pathname;
          const searchParams = new URLSearchParams(window.location.search);
          const intent = searchParams.get('intent');
          
          // Only redirect if we're on the auth page or landing page
          if (currentPath === '/auth' || currentPath === '/') {
            setTimeout(() => {
              if (intent === 'upgrade') {
                window.location.href = '/dashboard?upgrade=true';
              } else {
                window.location.href = '/dashboard';
              }
            }, 100);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check LinkedIn connection for existing session
      if (session?.user) {
        checkLinkedInConnection();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithMagicLink = async (email: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    linkedInConnected,
    linkedInProfile,
    linkedInOAuthInProgress,
    signInWithMagicLink,
    signOut,
    checkLinkedInConnection,
    disconnectLinkedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
