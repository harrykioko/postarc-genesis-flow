
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, TrendingUp, Eye, Heart } from 'lucide-react';

interface ExamplePost {
  id: number;
  template: string;
  preview: string;
  author: string;
  location: string;
  views: string;
  reactions: string;
  timeAgo: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

const examplePosts: ExamplePost[] = [
  {
    id: 1,
    template: "Consultant",
    preview: "Ever wonder why 70% of digital transformations fail? After implementing AI solutions for Fortune 500s, I've identified the real culprit. It's not the technology - it's the people side that gets overlooked every single time.",
    author: "Sarah C.",
    location: "Marketing Director, NYC",
    views: "1.2k",
    reactions: "89",
    timeAgo: "2 hours ago",
    isNew: true,
    isFeatured: true
  },
  {
    id: 2,
    template: "Founder",
    preview: "We went from 0 to $1M ARR in 8 months. Here are the 3 brutal lessons that made the difference (and why most startups ignore them).",
    author: "Marcus R.",
    location: "Founder, Austin",
    views: "2.8k",
    reactions: "147",
    timeAgo: "4 hours ago"
  },
  {
    id: 3,
    template: "Sales",
    preview: "Last week, a client said 'This is exactly what we needed.' It wasn't luck. Here's my proven framework for consultative selling that closes 40% more deals.",
    author: "Jennifer W.",
    location: "Sales Leader, Chicago",
    views: "847",
    reactions: "52",
    timeAgo: "Yesterday"
  },
  {
    id: 4,
    template: "VC",
    preview: "I've reviewed 10,000+ pitches. The best founders all do this one thing differently. It's not what you think.",
    author: "David P.",
    location: "VC Partner, SF",
    views: "3.1k",
    reactions: "203",
    timeAgo: "12 min ago"
  },
  {
    id: 5,
    template: "HR",
    preview: "Question: What's the #1 reason top talent leaves? It's not salary. We reduced employee turnover by 40% with one simple change that costs nothing.",
    author: "Lisa T.",
    location: "HR Director, Boston",
    views: "1.6k",
    reactions: "94",
    timeAgo: "6 hours ago"
  },
  {
    id: 6,
    template: "Consultant",
    preview: "My biggest client just saved $2M annually. The solution was hiding in plain sight, but everyone missed it.",
    author: "Ahmed H.",
    location: "Consultant, London",
    views: "423",
    reactions: "31",
    timeAgo: "1 day ago"
  }
];

const templateColors = {
  "Consultant": {
    gradient: "from-blue-500 to-blue-600",
    border: "border-l-blue-500",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    avatar: "from-blue-400 to-blue-600"
  },
  "Founder": {
    gradient: "from-purple-500 to-purple-600",
    border: "border-l-purple-500",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    avatar: "from-purple-400 to-purple-600"
  },
  "Sales": {
    gradient: "from-green-500 to-green-600",
    border: "border-l-green-500",
    badge: "bg-green-100 text-green-700 border-green-200",
    avatar: "from-green-400 to-green-600"
  },
  "VC": {
    gradient: "from-orange-500 to-orange-600",
    border: "border-l-orange-500",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    avatar: "from-orange-400 to-orange-600"
  },
  "HR": {
    gradient: "from-pink-500 to-pink-600",
    border: "border-l-pink-500",
    badge: "bg-pink-100 text-pink-700 border-pink-200",
    avatar: "from-pink-400 to-pink-600"
  }
};

export const PostShowcase = () => {
  const [postsCreated, setPostsCreated] = useState(237);
  const [randomPulseId, setRandomPulseId] = useState<number | null>(null);

  useEffect(() => {
    const postsInterval = setInterval(() => {
      setPostsCreated(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    // Random pulse effect
    const pulseInterval = setInterval(() => {
      const randomPost = examplePosts[Math.floor(Math.random() * examplePosts.length)];
      setRandomPulseId(randomPost.id);
      setTimeout(() => setRandomPulseId(null), 2000);
    }, 8000);

    return () => {
      clearInterval(postsInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-midnight mb-8">
            See What Professionals Are Creating
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            Real posts generated by AI, shared by industry leaders
          </p>
        </div>

        {/* Enhanced Masonry Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            {examplePosts.map((post, index) => {
              const colors = templateColors[post.template];
              const isFeatured = post.isFeatured;
              const hasRandomPulse = randomPulseId === post.id;
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                  }}
                  className={`
                    bg-white rounded-2xl border-l-4 ${colors.border} shadow-lg 
                    hover:shadow-xl transition-all duration-300 cursor-pointer group relative
                    ${isFeatured ? 'md:scale-110 md:z-10' : ''}
                    ${hasRandomPulse ? 'animate-pulse-ring' : ''}
                  `}
                >
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Header - Badge and Time */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`text-xs px-2 py-1 ${colors.badge} border`}>
                        {post.template}
                      </Badge>
                      <div className="flex items-center text-xs text-slate">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>

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
                    
                    {/* Profile Section */}
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colors.avatar} rounded-full mr-3 flex items-center justify-center shadow-md`}>
                        <span className="text-white text-sm font-bold">
                          {post.author.split(' ')[0][0]}{post.author.split(' ')[1][0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-midnight text-sm">{post.author}</div>
                        <div className="text-slate text-xs">{post.location}</div>
                      </div>
                    </div>
                    
                    {/* Post Preview */}
                    <div className="mb-4">
                      <p className="text-base text-gray-900 leading-relaxed font-medium">
                        {post.preview}
                      </p>
                    </div>
                    
                    {/* Engagement Metrics */}
                    <div className="flex items-center space-x-4 text-slate text-sm mb-4">
                      <div className="flex items-center">
                        <span className="mr-1">👁️</span>
                        <span>{post.views} views</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">❤️</span>
                        <span>{post.reactions} reactions</span>
                      </div>
                    </div>

                    {/* Hover Read More Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                        Read full post
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          className="ml-1"
                        >
                          →
                        </motion.span>
                      </button>
                    </motion.div>
                  </div>

                  {/* Bottom Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/80 to-transparent rounded-b-2xl pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Live Posts Counter */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <motion.span
              key={postsCreated}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-sm font-medium text-midnight"
            >
              {postsCreated} posts created today
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
};
