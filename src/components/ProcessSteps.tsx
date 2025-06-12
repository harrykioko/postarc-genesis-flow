
import { Lightbulb, Sparkles, Share2, Check, ArrowRight, Award, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoCTA } from "./ui/DemoCTA";

interface ProcessStepsProps {
  onTryNowClick: () => void;
}

const steps = [
  {
    id: 1,
    icon: Lightbulb,
    title: "Drop Your Idea",
    subtitle: "Enter any topic or URL",
    description: "Type any topic or paste an article URL. Our AI instantly understands your context.",
    mockup: {
      type: "input",
      content: "AI in professional services"
    },
    stats: { time: "5 sec", action: "to start" }
  },
  {
    id: 2,
    icon: Sparkles,
    title: "AI Works Its Magic",
    subtitle: "Professional frameworks applied",
    description: "Watch as GPT-4 analyzes, structures, and optimizes your content for maximum engagement.",
    mockup: {
      type: "processing",
      content: "Analyzing context..."
    },
    stats: { time: "10 sec", action: "to generate" }
  },
  {
    id: 3,
    icon: Share2,
    title: "Copy & Share",
    subtitle: "LinkedIn-ready in seconds",
    description: "Get a polished post with engagement metrics. One click to copy or share directly.",
    mockup: {
      type: "result",
      content: "🚀 The future of professional services is here..."
    },
    stats: { time: "91%", action: "quality score" }
  }
];

export const ProcessSteps = ({ onTryNowClick }: ProcessStepsProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance through steps
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 3) {
          setIsAutoPlaying(false);
          return 3;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Stop auto-play on user interaction
  const handleStepClick = (stepId: number) => {
    setIsAutoPlaying(false);
    setActiveStep(stepId);
  };

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">          
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">
            How It Works
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            From blank page to LinkedIn post in seconds
          </p>
        </div>

        {/* Desktop Experience */}
        <div className="hidden lg:block max-w-7xl mx-auto">
          {/* Progress Bar and Steps Container */}
          <div className="relative mb-16">
            {/* Progress Line - positioned to align with step circles */}
            <div className="absolute top-10 left-0 right-0 flex items-center">
              <div className="w-full h-0.5 bg-gray-200"></div>
            </div>
            <motion.div
              className="absolute top-10 left-0 h-0.5 bg-gradient-to-r from-neon to-mint"
              initial={{ width: "0%" }}
              animate={{ width: `${(activeStep / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Step Indicators */}
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className="group relative flex flex-col items-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative transition-all duration-300`}
                  >
                    {/* Outer ring animation for active step */}
                    {activeStep === step.id && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.3, opacity: 0.3 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-neon rounded-full"
                      />
                    )}
                    
                    {/* Main circle - properly sized and positioned */}
                    <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
                      activeStep === step.id 
                        ? 'bg-neon border-neon shadow-lg shadow-neon/30' 
                        : activeStep > step.id
                        ? 'bg-neon/90 border-neon'
                        : 'bg-white border-gray-300'
                    }`}>
                      <step.icon className={`w-9 h-9 transition-colors duration-300 ${
                        activeStep >= step.id ? 'text-midnight' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    {/* Step number badge */}
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      activeStep >= step.id
                        ? 'bg-midnight text-white shadow-md'
                        : 'bg-white border-2 border-gray-300 text-gray-600'
                    }`}>
                      {activeStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                  </motion.div>
                  
                  {/* Step labels - positioned below the circles */}
                  <div className="mt-4 text-center">
                    <p className={`font-semibold text-sm transition-colors duration-300 ${
                      activeStep === step.id ? 'text-midnight' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {step.stats.time} {step.stats.action}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area - Always visible, animated transitions */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Live Mockup */}
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative">
                {/* Browser Frame */}
                <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center space-x-2 px-4 py-3 border-b border-gray-200">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-gray-100 rounded-md px-4 py-1 text-xs text-gray-600">
                        postarc.ai/dashboard
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {activeStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            What's on your mind?
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value="AI in professional services"
                              className="w-full px-4 py-3 border-2 border-neon/50 rounded-lg bg-neon/5 text-midnight font-medium"
                              readOnly
                            />
                            <motion.div
                              className="absolute right-3 top-3"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Zap className="w-5 h-5 text-neon" />
                            </motion.div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Choose your voice
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {["Consultant", "Founder", "Sales", "VC"].map((voice, idx) => (
                              <motion.div
                                key={voice}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-3 rounded-lg border text-center text-sm font-medium ${
                                  idx === 0 
                                    ? "border-neon bg-neon/10 text-midnight shadow-md" 
                                    : "border-gray-200 bg-white text-gray-600"
                                }`}
                              >
                                {voice}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 text-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-20 h-20 mx-auto mb-6"
                        >
                          <div className="relative w-full h-full">
                            <div className="absolute inset-0 bg-neon/20 rounded-full animate-ping"></div>
                            <div className="relative w-full h-full bg-gradient-to-r from-neon to-mint rounded-full flex items-center justify-center">
                              <Sparkles className="w-10 h-10 text-midnight" />
                            </div>
                          </div>
                        </motion.div>
                        
                        <div className="space-y-3">
                          {["Analyzing context", "Applying frameworks", "Optimizing engagement"].map((text, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.3 }}
                              className="flex items-center justify-center space-x-2"
                            >
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: idx * 0.2 }}
                                className="w-2 h-2 bg-neon rounded-full"
                              />
                              <span className="text-gray-600">{text}...</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center space-x-2"
                          >
                            <Award className="w-5 h-5 text-neon" />
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              Quality Score: 91%
                            </span>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex space-x-2"
                          >
                            <button className="px-4 py-2 bg-neon text-midnight rounded-lg font-medium text-sm hover:bg-neon/90">
                              Copy
                            </button>
                            <button className="px-4 py-2 bg-midnight text-white rounded-lg font-medium text-sm hover:bg-midnight/90">
                              Share
                            </button>
                          </motion.div>
                        </div>
                        
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <p className="text-gray-900 leading-relaxed">
                            🚀 The AI revolution in professional services isn't coming—it's here.
                            <br /><br />
                            Forward-thinking firms are already leveraging AI to deliver 10x value 
                            while others debate its potential.
                            <br /><br />
                            The question isn't IF you should adopt AI, but HOW FAST you can integrate 
                            it into your practice.
                            <br /><br />
                            What's holding your firm back? 👇
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Floating elements for visual interest */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-20 h-20 bg-neon/10 rounded-full blur-xl"
                />
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 w-32 h-32 bg-mint/10 rounded-full blur-xl"
                />
              </div>
            </motion.div>

            {/* Right: Description */}
            <motion.div
              key={`desc-${activeStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <div className="inline-flex items-center space-x-2 bg-neon/10 px-3 py-1 rounded-full mb-4">
                  <span className="text-xs font-medium text-midnight">Step {activeStep} of 3</span>
                </div>
                
                <h3 className="text-3xl font-heading font-bold text-midnight mb-4">
                  {steps[activeStep - 1].title}
                </h3>
                <p className="text-xl text-slate mb-6">
                  {steps[activeStep - 1].description}
                </p>
              </div>

              <div className="space-y-4">
                {activeStep === 1 && (
                  <>
                    <Feature icon={Check} text="Smart topic suggestions based on trending content" />
                    <Feature icon={Check} text="URL scraping extracts key insights from any article" />
                    <Feature icon={Check} text="5 professional voice templates to match your style" />
                  </>
                )}
                
                {activeStep === 2 && (
                  <>
                    <Feature icon={Check} text="GPT-4 powered analysis for professional insights" />
                    <Feature icon={Check} text="Industry-specific frameworks automatically applied" />
                    <Feature icon={Check} text="Engagement optimization based on 50,000+ posts" />
                  </>
                )}
                
                {activeStep === 3 && (
                  <>
                    <Feature icon={Check} text="Quality score ensures your post will perform" />
                    <Feature icon={Check} text="One-click copy with perfect LinkedIn formatting" />
                    <Feature icon={Check} text="Direct share to LinkedIn with pre-filled content" />
                  </>
                )}
              </div>

              {/* Step Navigation Dots */}
              <div className="flex items-center space-x-3 pt-6">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={`transition-all duration-300 ${
                      activeStep === step.id 
                        ? 'w-8 h-2 bg-neon rounded-full' 
                        : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                    }`}
                    aria-label={`Go to step ${step.id}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile: Vertical Cards */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden">
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-neon/10 rounded-xl flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-neon" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-midnight">{step.title}</h3>
                      <p className="text-xs text-gray-500">{step.stats.time} {step.stats.action}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-midnight text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{step.description}</p>
                
                {/* Mini mockup preview */}
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  {step.mockup.content}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <DemoCTA onClick={onTryNowClick} />
        </motion.div>
      </div>
    </section>
  );
};

// Feature component
const Feature = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-start space-x-3"
  >
    <div className="w-6 h-6 bg-neon/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-neon" />
    </div>
    <span className="text-gray-700">{text}</span>
  </motion.div>
);
