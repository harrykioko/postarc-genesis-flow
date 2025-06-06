
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
  const [loading, setLoading] = useState(true);

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select('id, prompt_topic, content, created_at, template_used')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      const transformedPosts = data.map(post => ({
        id: post.id,
        preview: post.content.substring(0, 60) + "...",
        date: formatRelativeTime(new Date(post.created_at)),
        fullText: post.content,
        template: post.template_used
      }));

      setRecentPosts(transformedPosts);
    } catch (error) {
      console.error('Failed to fetch recent posts:', error);
      toast({
        title: "Failed to load history",
        description: "Could not load your recent posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileComplete) {
      fetchRecentPosts();
    }
  }, [profileComplete]);

  return {
    recentPosts,
    loading,
    refreshPosts: fetchRecentPosts
  };
};
