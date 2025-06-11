import { Lightbulb, Sparkles, Share2, X, Check } from "lucide-react";
import { useState } from "react";
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
    description: "Type any topic or paste an article URL. Pick your professional voice from 5 templates.",
    features: ["Auto-fills trending topics", "5 professional templates", "URL scraping included"],
    theme: {
      bg: "from-blue-50 to-blue-100/50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      accentColor: "text-blue-600"
    }
  },
  {
    id: 2,
    icon: Sparkles,
    title: "AI Works Its Magic",
    subtitle: "Generating your post",
    description: "Watch as our AI analyzes context, applies frameworks, and optimizes for engagement.",
    features: ["Powered by GPT-4", "Professional frameworks", "10-second generation"],
    theme: {
      bg: "from-purple-50 to-purple-100/50",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      accentColor: "text-purple-600"
    }
  },
  {
    id: 3,
    icon: Share2,
    title: "Copy & Share",
    subtitle: "Your post is ready",
    description: "Get a polished, LinkedIn-optimized post with quality score. One click to copy or share.",
    features: ["Quality score included", "One-click sharing", "SEO optimized"],
    theme: {
      bg: "from-green-50 to-green-100/50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      accentColor: "text-green-600"
    }
  }
];

const StepMockup = ({ stepId }: { stepId: number }) => {
  if (stepId === 1) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic or URL</label>
            <input
              type="text"
              placeholder="e.g., 'AI in professional services' or paste an article URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose your professional voice</label>
            <div className="grid grid-cols-2 gap-2">
              {["Consultant", "Founder", "Sales", "VC", "HR"].map((voice, idx) => (
                <div
                  key={voice}
                  className={`p-3 rounded-lg border text-center text-sm font-medium cursor-pointer ${
                    idx === 0 
                      ? "border-blue-500 bg-blue-50 text-blue-700" 
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  {voice}
                  {idx === 0 && <span className="block text-xs text-blue-500">Most Popular</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stepId === 2) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 relative"
            >
              <Sparkles className="w-16 h-16 text-purple-500" />
            </motion.div>
          </div>
          <div className="space-y-4">
            {[
              { text: "Analyzing your topic...", desc: "Understanding context and audience" },
              { text: "Crafting your post...", desc: "Applying professional frameworks" },
              { text: "Adding final touches...", desc: "Optimizing for engagement" }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.3 }}
                className="flex items-center space-x-3"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.3 + 0.2 }}
                    className="w-3 h-3 rounded-full bg-purple-500"
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{step.text}</div>
                  <div className="text-sm text-gray-500">{step.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stepId === 3) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Quality Score: 91%
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-neon text-midnight rounded-lg font-medium text-sm">
                Copy
              </button>
              <button className="px-4 py-2 bg-midnight text-white rounded-lg font-medium text-sm">
                Share
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 text-sm leading-relaxed">
              🚀 Embracing AI in Professional Services
              <br /><br />
              The landscape is shifting rapidly. While some firms hesitate, forward-thinking professionals are already leveraging AI to:
              <br /><br />
              ✅ Automate routine tasks<br />
              ✅ Enhance client insights<br />
              ✅ Deliver faster results
              <br /><br />
              The question isn't whether AI will transform our industry—it's whether you'll lead or follow.
              <br /><br />
              What's your take? 👇
            </p>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex space-x-4">
              <span>179 words</span>
              <span>1 min read</span>
              <span>LinkedIn Optimized</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            {["SEO Optimized", "Engagement Ready", "Professional Tone"].map((badge) => (
              <div key={badge} className="flex items-center space-x-1">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">{badge}</span>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm font-medium">
              🎉 This post is ready to drive engagement on LinkedIn!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const ProcessSteps = ({ onTryNowClick }: ProcessStepsProps) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const getCardPosition = (stepId: number, expanded: number | null) => {
    if (expanded === null) {
      // Collapsed state - stacked positioning
      return { top: (stepId - 1) * 140, zIndex: 25 - stepId };
    }
    
    if (stepId === expanded) {
      // Expanded card goes to top
      return { top: 0, zIndex: 30 };
    }
    
    // Other cards stack below expanded card
    const otherCards = steps.filter(s => s.id !== expanded);
    const indexInOthers = otherCards.findIndex(s => s.id === stepId);
    return { top: 420 + (indexInOthers * 60), zIndex: 20 - indexInOthers };
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">How It Works</h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">From blank page to LinkedIn post in seconds</p>
        </div>

        {/* Desktop: Interactive Stacked Cards */}
        <div className="hidden md:block">
          <div className="max-w-3xl mx-auto relative" style={{ height: expandedCard ? '480px' : '480px' }}>
            {steps.map((step) => {
              const position = getCardPosition(step.id, expandedCard);
              const isExpanded = expandedCard === step.id;
              
              return (
                <motion.div
                  key={step.id}
                  layout
                  className={`absolute left-0 right-0 bg-gradient-to-br ${step.theme.bg} ${step.theme.border} border-2 rounded-2xl shadow-xl cursor-pointer overflow-hidden`}
                  style={{ top: position.top, zIndex: position.zIndex }}
                  animate={{ 
                    height: isExpanded ? 400 : 180,
                  }}
                  whileHover={!isExpanded ? { scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" } : {}}
                  onClick={() => setExpandedCard(isExpanded ? null : step.id)}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                >
                  {/* Header - Always Visible */}
                  <div className="p-6 flex items-center space-x-4">
                    <div className={`w-16 h-16 ${step.theme.iconBg} rounded-2xl flex items-center justify-center relative`}>
                      <step.icon className={`w-8 h-8 ${step.theme.iconColor}`} />
                      <div className={`absolute -top-2 -right-2 w-8 h-8 bg-midnight text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                        {step.id}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-heading font-bold text-midnight mb-1">{step.title}</h3>
                      <p className="text-slate">{step.subtitle}</p>
                    </div>
                    {!isExpanded && (
                      <div className="text-slate text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to expand →
                      </div>
                    )}
                    {isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCard(null);
                        }}
                        className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1 }}
                        className="px-6 pb-6"
                      >
                        <div className="grid lg:grid-cols-2 gap-6">
                          {/* Left: Mockup */}
                          <div>
                            <StepMockup stepId={step.id} />
                          </div>
                          
                          {/* Right: Description & Features */}
                          <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed">{step.description}</p>
                            
                            <div className="space-y-2">
                              {step.features.map((feature, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 + idx * 0.1 }}
                                  className="flex items-center space-x-2"
                                >
                                  <Check className={`w-4 h-4 ${step.theme.iconColor}`} />
                                  <span className="text-gray-700">{feature}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Simple Vertical Layout */}
        <div className="md:hidden space-y-6">
          {steps.map((step) => (
            <div key={step.id} className={`bg-gradient-to-br ${step.theme.bg} ${step.theme.border} border-2 rounded-2xl p-6`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 ${step.theme.iconBg} rounded-2xl flex items-center justify-center relative`}>
                  <step.icon className={`w-8 h-8 ${step.theme.iconColor}`} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-midnight text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-midnight mb-1">{step.title}</h3>
                  <p className="text-slate">{step.subtitle}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{step.description}</p>
              <div className="space-y-2">
                {step.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Check className={`w-4 h-4 ${step.theme.iconColor}`} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <DemoCTA onClick={onTryNowClick} />
        </div>
      </div>
    </section>
  );
};
