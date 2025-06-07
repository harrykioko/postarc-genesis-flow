
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  syncLinkedInProfile: (accessToken: string) => Promise<{ error: any }>;
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

  const checkLinkedInConnection = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('linkedin_member_id, linkedin_access_token, linkedin_token_expires_at, linkedin_profile_url, linkedin_profile_image_url, name, linkedin_head, linkedin_industry')
        .eq('id', user.id)
        .single();

      if (error || !profile?.linkedin_access_token) {
        setLinkedInConnected(false);
        setLinkedInProfile(null);
        return false;
      }

      // Check if token is expired
      const expiresAt = profile.linkedin_token_expires_at;
      if (expiresAt && new Date(expiresAt) <= new Date()) {
        setLinkedInConnected(false);
        setLinkedInProfile(null);
        return false;
      }

      setLinkedInConnected(true);
      setLinkedInProfile({
        member_id: profile.linkedin_member_id,
        profile_url: profile.linkedin_profile_url,
        profile_image_url: profile.linkedin_profile_image_url,
        name: profile.name,
        headline: profile.linkedin_head,
        industry: profile.linkedin_industry
      });
      return true;
    } catch (error) {
      console.error('Error checking LinkedIn connection:', error);
      setLinkedInConnected(false);
      setLinkedInProfile(null);
      return false;
    }
  };

  const syncLinkedInProfile = async (accessToken: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('linkedin-profile-sync', {
        body: { access_token: accessToken }
      });
      
      if (error) {
        console.error('LinkedIn profile sync error:', error);
        return { error };
      }

      // Refresh LinkedIn connection status
      await checkLinkedInConnection();
      
      return { error: null };
    } catch (error: any) {
      console.error('LinkedIn profile sync error:', error);
      return { error };
    }
  };

  const disconnectLinkedIn = async () => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('users')
        .update({
          linkedin_access_token: null,
          linkedin_token_expires_at: null,
          linkedin_member_id: null,
          linkedin_profile_url: null,
          linkedin_profile_image_url: null,
          linkedin_head: null,
          linkedin_industry: null
        })
        .eq('id', user.id);

      if (error) throw error;

      setLinkedInConnected(false);
      setLinkedInProfile(null);
      
      return { error: null };
    } catch (error: any) {
      console.error('Error disconnecting LinkedIn:', error);
      return { error };
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check LinkedIn connection when user signs in
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            checkLinkedInConnection();
          }, 100);
        }
        
        // Clear LinkedIn state when user signs out
        if (event === 'SIGNED_OUT') {
          setLinkedInConnected(false);
          setLinkedInProfile(null);
        }
        
        // Handle redirect after successful authentication
        if (event === 'SIGNED_IN' && session?.user) {
          const currentPath = window.location.pathname;
          const searchParams = new URLSearchParams(window.location.search);
          const intent = searchParams.get('intent');
          
          // Only redirect if we're on the auth page or landing page
          // This prevents disrupting users who are already on protected pages
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
    signInWithMagicLink,
    signOut,
    syncLinkedInProfile,
    checkLinkedInConnection,
    disconnectLinkedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
