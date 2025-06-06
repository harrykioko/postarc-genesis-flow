
import { Loader2 } from "lucide-react";
import { PostsGrid } from "./PostsGrid";
import { ViewAllButton } from "./ViewAllButton";

interface Post {
  id: string;
  preview: string;
  date: string;
  fullText?: string;
  template?: string;
}

interface PostHistoryContentProps {
  postsToShow: Post[];
  isLoadingPosts: boolean;
  showAllPosts: boolean;
  loadingAll: boolean;
  recentPosts: Post[];
  onPostClick: (post: Post) => void;
  onViewAllClick: () => void;
}

export const PostHistoryContent = ({
  postsToShow,
  isLoadingPosts,
  showAllPosts,
  loadingAll,
  recentPosts,
  onPostClick,
  onViewAllClick
}: PostHistoryContentProps) => {
  if (isLoadingPosts) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-neon mr-2" />
        <span className="text-slate">Loading your posts...</span>
      </div>
    );
  }

  if (postsToShow.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate mb-2">No posts yet</div>
        <div className="text-xs text-slate">Generate your first post to see it here!</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PostsGrid
        posts={postsToShow}
        showAllPosts={showAllPosts}
        onPostClick={onPostClick}
      />
      
      {recentPosts.length > 0 && (
        <ViewAllButton
          showAllPosts={showAllPosts}
          loadingAll={loadingAll}
          onViewAllClick={onViewAllClick}
        />
      )}
    </div>
  );
};
