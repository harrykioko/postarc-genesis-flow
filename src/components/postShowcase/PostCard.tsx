
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from 'lucide-react';
import { ExamplePost, TemplateColors } from './data/postShowcaseData';

interface PostCardProps {
  post: ExamplePost;
  index: number;
  colors: TemplateColors;
}

export const PostCard = ({ post, index, colors }: PostCardProps) => {
  const initials = post.author.split(' ').map(name => name[0]).join('');

  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative card-float hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {/* Colored Top Bar */}
      <div className={`h-1 bg-gradient-to-r ${colors.topBar}`}></div>
      
      {/* Card Content */}
      <div className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          {/* Left: Avatar + Author */}
          <div className="flex items-center gap-3">
            {/* Gradient Avatar */}
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors.avatar} flex items-center justify-center text-white font-bold shadow-md`}>
              {initials}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{post.author}</h4>
              <p className="text-sm text-gray-500">{post.location}</p>
            </div>
          </div>
          
          {/* Right: Time */}
          <span className="text-xs text-gray-400">{post.timeAgo}</span>
        </div>
        
        {/* Template Badge */}
        <span className={`inline-block px-3 py-1 ${colors.badge} text-xs font-medium rounded-full mb-3`}>
          {post.template} Template
        </span>
        
        {/* NEW Badge */}
        {post.isNew && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-neon text-midnight font-bold">
              <motion.span
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                NEW
              </motion.span>
            </Badge>
          </div>
        )}
        
        {/* Post Preview - LARGER TEXT */}
        <p className="text-gray-900 text-lg font-medium leading-relaxed mb-4 line-clamp-3">
          {post.preview}
        </p>
        
        {/* Engagement Metrics with REAL ICONS */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {post.views} views
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            {post.reactions} reactions
          </span>
        </div>
      </div>
    </motion.div>
  );
};
