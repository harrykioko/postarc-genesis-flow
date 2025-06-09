
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { formatRelativeTime } from '@/utils/postUtils';

interface UserStats {
  totalPosts: number;
  monthlyUsage: number;
  monthlyLimit: number | 'unlimited';
  mostUsedTemplate: string;
  averageLength: number;
  lastActivity: string;
  memberSince: string;
  loading: boolean;
  error: string | null;
}

export const useUserStats = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [stats, setStats] = useState<UserStats>({
    totalPosts: 0,
    monthlyUsage: 0,
    monthlyLimit: 5,
    mostUsedTemplate: 'None',
    averageLength: 0,
    lastActivity: 'Never',
    memberSince: 'Unknown',
    loading: true,
    error: null,
  });

  const fetchUserStats = async () => {
    if (!user) {
      console.log('❌ No user found, setting default stats');
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      console.log('📊 Fetching user stats for:', user.id);

      // Fetch all user posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, content, template_used, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('❌ Posts fetch error:', postsError);
        throw postsError;
      }

      console.log('📝 Found posts:', posts?.length || 0);

      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Calculate statistics
      const totalPosts = posts?.length || 0;
      const monthlyPosts = posts?.filter(post => 
        new Date(post.created_at) >= currentMonth
      ) || [];
      const monthlyUsage = monthlyPosts.length;

      // Most used template
      const templateCounts = posts?.reduce((acc, post) => {
        const template = post.template_used || 'Custom';
        acc[template] = (acc[template] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      const mostUsedTemplate = Object.keys(templateCounts).length > 0
        ? Object.keys(templateCounts).reduce((a, b) => 
            templateCounts[a] > templateCounts[b] ? a : b
          )
        : 'None';

      // Average word count
      const totalWords = posts?.reduce((sum, post) => {
        return sum + (post.content?.split(' ').length || 0);
      }, 0) || 0;
      const averageLength = totalPosts > 0 ? Math.round(totalWords / totalPosts) : 0;

      // Last activity
      const lastActivity = posts && posts.length > 0
        ? formatRelativeTime(new Date(posts[0].created_at))
        : 'Never';

      // Member since
      const memberSince = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          })
        : user.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          })
        : 'Unknown';

      // Get quota limit from user role
      const monthlyLimit = profile?.role === 'pro' 
        ? 15
        : profile?.role === 'legend' 
        ? 'unlimited' as const
        : 5;

      const formattedStats = {
        totalPosts,
        monthlyUsage,
        monthlyLimit,
        mostUsedTemplate,
        averageLength,
        lastActivity,
        memberSince,
        loading: false,
        error: null,
      };

      console.log('✅ Calculated user stats:', formattedStats);
      setStats(formattedStats);

    } catch (error) {
      console.error('💥 Error fetching user stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load statistics',
      }));
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user, profile]);

  const refreshStats = () => {
    console.log('🔄 Manually refreshing user stats...');
    fetchUserStats();
  };

  return { ...stats, refreshStats };
};
