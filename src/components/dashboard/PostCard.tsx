
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  preview: string;
  date: string;
  fullText?: string;
  template?: string;
}

interface PostCardProps {
  post: Post;
  index: number;
  showAllPosts: boolean;
  onPostClick: (post: Post) => void;
}

// Template color mapping to match PostGenerator
const getTemplateColor = (template: string) => {
  const colorMap: Record<string, string> = {
    consultant: "bg-blue-500 text-white border-blue-500",
    founder: "bg-purple-500 text-white border-purple-500",
    vc: "bg-green-500 text-white border-green-500",
    sales: "bg-orange-500 text-white border-orange-500",
    hr: "bg-pink-500 text-white border-pink-500",
    business_representative: "bg-indigo-500 text-white border-indigo-500",
    custom: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500",
  };
  
  // Handle custom templates
  if (template.startsWith('custom-')) {
    return colorMap.custom;
  }
  
  return colorMap[template.toLowerCase()] || "bg-neon/10 text-neon border-neon/30";
};

const formatTemplateName = (template: string) => {
  if (template.startsWith('custom-')) {
    return 'Custom Template';
  }
  // Capitalize first letter for built-in templates
  return template.charAt(0).toUpperCase() + template.slice(1);
};

const truncateText = (text: string, maxLength = 200) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const PostCard = ({ post, index, showAllPosts, onPostClick }: PostCardProps) => {
  return (
    <div
      key={post.id}
      className={`group relative p-4 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:bg-gradient-to-br hover:from-white/90 hover:to-white/70 ${
        index === 0 && !showAllPosts ? 'animate-slide-in-item' : ''
      }`}
      onClick={() => onPostClick(post)}
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
                {formatTemplateName(post.template)}
              </Badge>
            )}
          </div>
          <span className="text-xs text-slate">{post.date}</span>
        </div>
      </div>
    </div>
  );
};
