
import { PostCard } from './PostCard';
import { examplePosts, templateColors } from './data/postShowcaseData';

export const PostsGrid = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
      {examplePosts.map((post, index) => {
        const colors = templateColors[post.template];
        
        return (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            colors={colors}
          />
        );
      })}
    </div>
  );
};
