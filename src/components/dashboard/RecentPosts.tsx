import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, ClipboardCopy, Loader2 } from "lucide-react";

interface Post {
  id: string;
  preview: string;
  date: string;
  fullText?: string;
}

interface RecentPostsProps {
  recentPosts: Post[];
  onCopy: (text: string) => void;
  loading?: boolean;
}

export const RecentPosts = ({ recentPosts, onCopy, loading = false }: RecentPostsProps) => {
  const handlePostClick = (post: Post) => {
    // Use fullText if available, otherwise fall back to preview
    const textToCopy = post.fullText || post.preview;
    onCopy(textToCopy);
  };

  return (
    <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-neon" />
          <CardTitle className="font-heading text-midnight">Recent Posts</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          // Loading state
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-neon mr-2" />
            <span className="text-slate">Loading your posts...</span>
          </div>
        ) : recentPosts.length === 0 ? (
          // Empty state
          <div className="text-center py-8">
            <div className="text-slate mb-2">No posts yet</div>
            <div className="text-xs text-slate">Generate your first post to see it here!</div>
          </div>
        ) : (
          // Posts list
          recentPosts.map((post, index) => (
            <div 
              key={post.id} 
              className={`group relative p-3 bg-slate/5 rounded-lg transition-all duration-200 hover:bg-slate/10 hover:shadow-md cursor-pointer ${
                index === 0 ? 'animate-slide-in-item' : ''
              }`}
              onClick={() => handlePostClick(post)}
              role="button"
              tabIndex={0}
              aria-label={`Copy post: ${post.preview}`}
            >
              <div className="text-sm text-midnight mb-1 pr-8">{post.preview}</div>
              <div className="text-xs text-slate">{post.date}</div>
              <ClipboardCopy className="absolute top-3 right-3 w-4 h-4 text-slate opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          ))
        )}
        
        {/* View All History Button - only show if we have posts */}
        {!loading && recentPosts.length > 0 && (
          <Button variant="outline" className="w-full mt-3 border-midnight hover:bg-mint hover:text-midnight">
            View All History
          </Button>
        )}
      </CardContent>
    </Card>
  );
};