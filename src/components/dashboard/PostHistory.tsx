import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ClipboardCopy, ExternalLink, Loader2 } from "lucide-react";
import { PostPreviewModal } from "./PostPreviewModal";

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

// Template color mapping to match PostGenerator
const getTemplateColor = (template: string) => {
  const colorMap: Record<string, string> = {
    consultant: "bg-blue-500 text-white border-blue-500",
    founder: "bg-purple-500 text-white border-purple-500",
    vc: "bg-green-500 text-white border-green-500",
    sales: "bg-orange-500 text-white border-orange-500",
    hr: "bg-pink-500 text-white border-pink-500",
  };
  
  return colorMap[template.toLowerCase()] || "bg-neon/10 text-neon border-neon/30";
};

export const PostHistory = ({ recentPosts, onCopy, loading = false }: PostHistoryProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handlePostCopy = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    const textToCopy = post.fullText || post.preview;
    onCopy(textToCopy);
  };

  const handleLinkedInOpen = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    const textToShare = post.fullText || post.preview;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(textToShare)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const truncateText = (text: string, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
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
            <div className="space-y-6">
              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className={`group relative p-4 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:bg-gradient-to-br hover:from-white/90 hover:to-white/70 ${
                      index === 0 ? 'animate-slide-in-item' : ''
                    }`}
                    onClick={() => handlePostClick(post)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View post: ${truncateText(post.preview, 50)}`}
                  >
                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-sm text-midnight leading-relaxed mb-3 min-h-[60px]">
                        {truncateText(post.preview)}
                      </p>
                      
                      {/* Post Meta */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {post.template && (
                            <Badge variant="outline" className={`text-xs ${getTemplateColor(post.template)}`}>
                              {post.template}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-slate">{post.date}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handlePostCopy(e, post)}
                        className="h-8 w-8 p-0 hover:bg-mint/20 rounded-full"
                        aria-label="Copy post content"
                      >
                        <ClipboardCopy className="w-3.5 h-3.5 text-slate hover:text-midnight" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleLinkedInOpen(e, post)}
                        className="h-8 w-8 p-0 hover:bg-mint/20 rounded-full"
                        aria-label="Open in LinkedIn"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate hover:text-midnight" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View All History Button */}
              {recentPosts.length > 0 && (
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline" 
                    className="bg-white/60 backdrop-blur-sm border-neon/30 text-neon hover:bg-neon/10 hover:border-neon/50 transition-all duration-200"
                  >
                    View All History
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Post Preview Modal */}
      <PostPreviewModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCopy={onCopy}
      />
    </>
  );
};
