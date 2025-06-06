
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatRelativeTime } from '@/utils/postUtils';

interface RecentPost {
  id: string;
  preview: string;
  date: string;
  fullText: string;
  template?: string;
}

export const useRecentPosts = (profileComplete: boolean) => {
  const { toast } = useToast();
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [allPosts, setAllPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAll, setLoadingAll] = useState(false);

  const fetchPosts = async (limit?: number) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('posts')
        .select('id, prompt_topic, content, created_at, template_used')
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      const transformedPosts = data.map(post => ({
        id: post.id,
        preview: post.content.substring(0, 200) + "...",
        date: formatRelativeTime(new Date(post.created_at)),
        fullText: post.content,
        template: post.template_used
      }));

      if (limit) {
        setRecentPosts(transformedPosts);
      } else {
        setAllPosts(transformedPosts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast({
        title: "Failed to load history",
        description: "Could not load your posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingAll(false);
    }
  };

  const fetchAllPosts = async () => {
    try {
      setLoadingAll(true);
      await fetchPosts(); // No limit for all posts
    } catch (error) {
      console.error('Failed to fetch all posts:', error);
    }
  };

  const fetchRecentPosts = async () => {
    await fetchPosts(6); // Limit to 6 for recent posts
  };

  useEffect(() => {
    if (profileComplete) {
      fetchRecentPosts();
    }
  }, [profileComplete]);

  return {
    recentPosts,
    allPosts,
    loading,
    loadingAll,
    refreshPosts: fetchRecentPosts,
    fetchAllPosts
  };
};
