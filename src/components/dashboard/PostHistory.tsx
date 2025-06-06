
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ClipboardCopy, ExternalLink, Loader2 } from "lucide-react";

interface Post {
  id: string;
  preview: string;
  date: string;
  fullText?: string;
  template?: string;
}

interface PostHistoryProps {
  recentPosts: Post[];
  onCopy: (text: string) => void;
  loading?: boolean;
}

export const PostHistory = ({ recentPosts, onCopy, loading = false }: PostHistoryProps) => {
  const handlePostCopy = (post: Post) => {
    const textToCopy = post.fullText || post.preview;
    onCopy(textToCopy);
  };

  const handleLinkedInOpen = (post: Post) => {
    const textToShare = post.fullText || post.preview;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(textToShare)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const truncateText = (text: string, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-neon" />
          <CardTitle className="font-heading text-midnight">Your Posts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-neon mr-2" />
            <span className="text-slate">Loading your posts...</span>
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate mb-2">No posts yet</div>
            <div className="text-xs text-slate">Generate your first post to see it here!</div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <div 
                key={post.id} 
                className={`group p-4 bg-slate/5 rounded-xl border border-slate/10 transition-all duration-200 hover:bg-slate/10 hover:shadow-md hover:border-mint/20 ${
                  index === 0 ? 'animate-slide-in-item' : ''
                }`}
              >
                {/* Post Content */}
                <div className="mb-3">
                  <p className="text-sm text-midnight leading-relaxed mb-2">
                    {truncateText(post.preview)}
                  </p>
                  
                  {/* Post Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {post.template && (
                        <Badge variant="outline" className="text-xs border-neon/30 text-neon">
                          {post.template}
                        </Badge>
                      )}
                      <span className="text-xs text-slate">{post.date}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePostCopy(post)}
                        className="h-8 w-8 p-0 hover:bg-mint/20"
                        aria-label="Copy post content"
                      >
                        <ClipboardCopy className="w-3.5 h-3.5 text-slate hover:text-midnight" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLinkedInOpen(post)}
                        className="h-8 w-8 p-0 hover:bg-mint/20"
                        aria-label="Open in LinkedIn"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate hover:text-midnight" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* View All Button */}
            {recentPosts.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full mt-4 border-midnight hover:bg-mint hover:text-midnight"
              >
                View All History
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
