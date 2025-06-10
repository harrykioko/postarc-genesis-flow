
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Share, Check } from 'lucide-react';

interface ProcessStepsProps {
  onTryNowClick: () => void;
}

export const ProcessSteps = ({ onTryNowClick }: ProcessStepsProps) => {
  const [typewriterText, setTypewriterText] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fullText = "AI in healthcare transformation...";

  useEffect(() => {
    // Typewriter effect for Step 1
    let index = 0;
    const typewriterInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typewriterInterval);
        // Start Step 2 loading after typewriter finishes
        setTimeout(() => setShowLoading(true), 500);
        // Show Step 3 success after loading
        setTimeout(() => {
          setShowLoading(false);
          setShowSuccess(true);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typewriterInterval);
  }, []);

  const steps = [
    {
      number: 1,
      title: "Enter Your Topic",
      description: "Share an idea, paste a URL, or describe what you want to post about",
      icon: Sparkles,
      gradient: "from-blue-500 to-blue-600",
      glowColor: "shadow-blue-500/30"
    },
    {
      number: 2,
      title: "Choose Your Style",
      description: "Select from Consultant, Founder, VC, Sales, or HR templates",
      icon: Brain,
      gradient: "from-purple-500 to-purple-600",
      glowColor: "shadow-purple-500/30"
    },
    {
      number: 3,
      title: "Share on LinkedIn",
      description: "Get your polished post in seconds, ready to copy and share",
      icon: Share,
      gradient: "from-neon to-mint",
      glowColor: "shadow-neon/30"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="text-midnight">Create Your First Post in </span>
            <span className="bg-gradient-to-r from-neon to-mint bg-clip-text text-transparent">
              60 Seconds
            </span>
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            Our intelligent 3-step process transforms your ideas into professional LinkedIn content
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Animated Progress Line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 z-0">
              <div className="relative w-full h-full bg-slate/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 2, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-neon rounded-full"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.number} className="text-center relative">
                    {/* Animated Step Circle */}
                    <div className="relative z-10 mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className={`w-40 h-40 mx-auto rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center relative overflow-hidden`}
                      >
                        {/* Step 1: Pulsing Glow */}
                        {index === 0 && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.gradient} opacity-30 blur-lg`}
                          />
                        )}
                        
                        {/* Step 2: Spinning Rings */}
                        {index === 1 && (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-2 border-4 border-white/30 rounded-full border-t-white"
                            />
                            <motion.div
                              animate={{ rotate: -360 }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-6 border-2 border-white/20 rounded-full border-r-white"
                            />
                          </>
                        )}
                        
                        {/* Step 3: Radiating Pulse */}
                        {index === 2 && (
                          <>
                            <motion.div
                              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="absolute inset-0 rounded-full bg-neon/30"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                              className="absolute inset-0 rounded-full bg-neon/20"
                            />
                          </>
                        )}
                        
                        {/* Icon Container */}
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center relative z-10">
                          <IconComponent className="w-12 h-12 text-midnight" />
                        </div>
                        
                        {/* Step Number */}
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-midnight text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                          {step.number}
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Step Content */}
                    <h3 className="text-2xl font-heading font-semibold mb-4 text-midnight">
                      {step.title}
                    </h3>
                    <p className="text-slate leading-relaxed mb-6">
                      {step.description}
                    </p>
                    
                    {/* Interactive Elements */}
                    <div className="h-8 flex items-center justify-center">
                      {index === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          viewport={{ once: true }}
                          className="text-sm text-neon font-mono bg-slate/10 px-3 py-1 rounded"
                        >
                          {typewriterText}
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="ml-1"
                          >
                            |
                          </motion.span>
                        </motion.div>
                      )}
                      
                      {index === 1 && showLoading && (
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                              className="w-2 h-2 bg-purple-500 rounded-full"
                            />
                          ))}
                        </div>
                      )}
                      
                      {index === 2 && showSuccess && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center space-x-2 text-green-600"
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Ready in 10 seconds</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button
              onClick={onTryNowClick}
              className="btn-neon px-10 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-neon/20"
            >
              Try It Now - Free
            </Button>
            <p className="text-sm text-slate mt-4">
              No signup required • See results instantly
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
