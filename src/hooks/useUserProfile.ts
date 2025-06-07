
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  job_title: string | null;
  linkedin_head: string | null;
  brand_voice: string | null;
  role: string;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const refreshProfile = () => {
    fetchProfile();
  };

  return {
    profile,
    loading,
    error,
    refreshProfile
  };
};
