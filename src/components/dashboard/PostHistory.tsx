
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type GeneratedPost = Database['public']['Tables']['generated_posts']['Row'];

const fetchRecentPosts = async (): Promise<GeneratedPost[]> => {
  const { data, error } = await supabase
    .from('generated_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data || [];
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  
  return date.toLocaleDateString();
};

const truncateContent = (content: string, maxLength: number = 200) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

export const PostHistory = () => {
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: fetchRecentPosts,
  });

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Post copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy manually",
        variant: "destructive",
      });
    }
  };

  const handleOpenInLinkedIn = (content: string) => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&text=${encodeURIComponent(content)}`;
    window.open(linkedinUrl, '_blank');
    
    toast({
      title: "Opening LinkedIn",
      description: "Your post is ready to share!",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold text-midnight">Your Posts</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4 rounded-xl animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-slate">Failed to load posts. Please try again.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold text-midnight">Your Posts</h2>
        <div className="glass-card p-8 rounded-xl text-center">
          <div className="w-16 h-16 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-neon" />
          </div>
          <h3 className="font-semibold text-midnight mb-2">No posts yet</h3>
          <p className="text-slate text-sm">Generate your first post using the tool above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading font-semibold text-midnight">Your Posts</h2>
      
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="glass-card p-4 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-neon/20 text-midnight text-xs">
                  {post.template_used || 'General'}
                </Badge>
                <span className="text-xs text-slate flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatRelativeTime(post.created_at)}
                </span>
              </div>
              
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(post.content)}
                  className="h-7 px-2 text-slate hover:text-midnight"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenInLinkedIn(post.content)}
                  className="h-7 px-2 text-slate hover:text-midnight"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-midnight leading-relaxed">
              {truncateContent(post.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
