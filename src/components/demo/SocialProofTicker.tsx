
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Users } from 'lucide-react';

const testimonials = [
  { name: "Sarah Chen", role: "Marketing Director", text: "Increased my LinkedIn engagement by 300%" },
  { name: "Mike Rodriguez", role: "Sales Manager", text: "Finally posts that sound like me, but better!" },
  { name: "Dr. Patel", role: "Consultant", text: "My posts now get CEO attention" },
  { name: "Lisa Kim", role: "Startup Founder", text: "Game-changer for my personal brand" }
];

const companies = ["Microsoft", "Google", "Amazon", "Meta", "Apple", "Netflix"];

export const SocialProofTicker = () => {
  const [postsCreated, setPostsCreated] = useState(247);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    // Simulate live counter
    const interval = setInterval(() => {
      setPostsCreated(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Live Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-4 bg-gradient-to-r from-neon/10 to-transparent rounded-lg border border-neon/20"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-neon" />
          <motion.span
            key={postsCreated}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="font-bold text-neon text-lg"
          >
            {postsCreated}
          </motion.span>
          <span className="text-midnight">posts created today</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <p className="text-xs text-slate">
          Trusted by 1,000+ professionals from top companies
        </p>
      </motion.div>

      {/* Rotating Testimonials */}
      <motion.div
        key={currentTestimonial}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white/30 rounded-lg p-3 border border-white/50"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-neon/20 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-neon fill-current" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-midnight italic mb-1">
              "{testimonials[currentTestimonial].text}"
            </p>
            <div className="text-xs text-slate">
              <span className="font-medium">{testimonials[currentTestimonial].name}</span>
              <span className="mx-1">•</span>
              <span>{testimonials[currentTestimonial].role}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Company Logos Scroll */}
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: [-300, 0] }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex items-center space-x-6 text-xs text-slate/60"
        >
          <Users className="w-3 h-3" />
          {companies.map((company, index) => (
            <span key={index} className="whitespace-nowrap font-medium">
              {company}
            </span>
          ))}
          {companies.map((company, index) => (
            <span key={`repeat-${index}`} className="whitespace-nowrap font-medium">
              {company}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
