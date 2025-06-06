
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { PostPreviewModal } from "./PostPreviewModal";
import { PostHistoryContent } from "./PostHistoryContent";

interface Post {
  id: string;
  preview: string;
  date: string;
  fullText?: string;
  template?: string;
}

interface PostHistoryProps {
  recentPosts: Post[];
  allPosts: Post[];
  onCopy: (text: string) => void;
  loading?: boolean;
  loadingAll?: boolean;
  onFetchAllPosts: () => void;
}

export const PostHistory = ({ 
  recentPosts, 
  allPosts, 
  onCopy, 
  loading = false, 
  loadingAll = false,
  onFetchAllPosts 
}: PostHistoryProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleViewAllClick = () => {
    if (!showAllPosts && allPosts.length === 0) {
      onFetchAllPosts();
    }
    setShowAllPosts(!showAllPosts);
  };

  const postsToShow = showAllPosts ? allPosts : recentPosts;
  const isLoadingPosts = loading || (showAllPosts && loadingAll);

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
          <PostHistoryContent
            postsToShow={postsToShow}
            isLoadingPosts={isLoadingPosts}
            showAllPosts={showAllPosts}
            loadingAll={loadingAll}
            recentPosts={recentPosts}
            onPostClick={handlePostClick}
            onViewAllClick={handleViewAllClick}
          />
        </CardContent>
      </Card>

      <PostPreviewModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCopy={onCopy}
      />
    </>
  );
};
