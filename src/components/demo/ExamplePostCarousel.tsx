
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, TrendingUp } from 'lucide-react';

interface ExamplePost {
  id: number;
  template: string;
  topic: string;
  preview: string;
  likes: number;
  comments: number;
  shares: number;
}

const examplePosts: ExamplePost[] = [
  {
    id: 1,
    template: "Consultant",
    topic: "AI in Business Strategy",
    preview: "After 15 years in consulting, I've seen countless digital transformations fail. Here's what actually works...",
    likes: 247,
    comments: 32,
    shares: 18
  },
  {
    id: 2,
    template: "Founder",
    topic: "Startup Lessons",
    preview: "We went from 0 to $1M ARR in 8 months. Here are the 3 brutal lessons that made the difference...",
    likes: 891,
    comments: 127,
    shares: 94
  },
  {
    id: 3,
    template: "Sales",
    topic: "Client Relationships",
    preview: "The client said 'This is exactly what we needed.' It wasn't luck. Here's my proven framework...",
    likes: 423,
    comments: 56,
    shares: 31
  },
  {
    id: 4,
    template: "VC",
    topic: "Market Trends",
    preview: "While everyone's talking about AI, smart investors are quietly betting on this emerging sector...",
    likes: 672,
    comments: 89,
    shares: 45
  }
];

export const ExamplePostCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % examplePosts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentPost = examplePosts[currentIndex];

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-midnight">See what others are creating</h4>
        <div className="flex space-x-1">
          {examplePosts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-neon' : 'bg-slate/30'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPost.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <div className="px-2 py-1 bg-neon/20 rounded text-xs font-medium text-midnight">
              {currentPost.template}
            </div>
            <div className="text-xs text-slate">
              Topic: {currentPost.topic}
            </div>
          </div>

          <div className="bg-white/50 rounded-lg p-4">
            <p className="text-sm text-midnight leading-relaxed">
              {currentPost.preview}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{currentPost.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{currentPost.comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Repeat2 className="w-3 h-3" />
                <span>{currentPost.shares}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>High engagement</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 text-xs text-slate bg-white/30 rounded-full px-3 py-1">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live demo - try it yourself!</span>
        </div>
      </div>
    </div>
  );
};
