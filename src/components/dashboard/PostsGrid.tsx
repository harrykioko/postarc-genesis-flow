
import { PostCard } from "./PostCard";

interface Post {
  id: string;
  preview: string;
  date: string;
  fullText?: string;
  template?: string;
}

interface PostsGridProps {
  posts: Post[];
  showAllPosts: boolean;
  onPostClick: (post: Post) => void;
}

export const PostsGrid = ({ posts, showAllPosts, onPostClick }: PostsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
          showAllPosts={showAllPosts}
          onPostClick={onPostClick}
        />
      ))}
    </div>
  );
};
