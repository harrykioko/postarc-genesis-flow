import { Lightbulb, Sparkles, Share2, Check, ArrowRight } from "lucide-react";
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

          <div className="flex items-center space-x-4 text-sm">
            {["SEO Optimized", "Engagement Ready", "Professional Tone"].map((badge) => (
              <div key={badge} className="flex items-center space-x-1">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const ProcessSteps = ({ onTryNowClick }: ProcessStepsProps) => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">How It Works</h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">From blank page to LinkedIn post in seconds</p>
        </div>

        {/* Desktop: Interactive Cards Grid */}
        <div className="hidden md:block max-w-7xl mx-auto">
          {/* Progress Line */}
          <div className="relative mb-12">
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200"></div>
            <div className="absolute top-8 left-0 h-0.5 bg-neon transition-all duration-500" style={{ 
              width: selectedStep ? `${(selectedStep / 3) * 100}%` : '0%' 
            }}></div>
            
            {/* Step Indicators */}
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setSelectedStep(step.id)}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className="group relative z-10"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedStep === step.id 
                        ? 'bg-neon shadow-lg' 
                        : hoveredStep === step.id
                        ? 'bg-neon/20 shadow-md'
                        : 'bg-white border-2 border-gray-200 shadow-sm'
                    }`}
                  >
                    <step.icon className={`w-8 h-8 transition-colors duration-300 ${
                      selectedStep === step.id 
                        ? 'text-midnight' 
                        : hoveredStep === step.id
                        ? step.theme.iconColor
                        : 'text-gray-400'
                    }`} />
                  </motion.div>
                  
                  {/* Step Number */}
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    selectedStep === step.id
                      ? 'bg-midnight text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  
                  {/* Step Title (appears on hover) */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      opacity: hoveredStep === step.id || selectedStep === step.id ? 1 : 0,
                      y: hoveredStep === step.id || selectedStep === step.id ? 0 : -10
                    }}
                    className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <span className={`text-sm font-semibold ${
                      selectedStep === step.id ? 'text-midnight' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </span>
                  </motion.div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {selectedStep ? (
              <motion.div
                key={selectedStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-8 items-start"
              >
                {/* Left: Description */}
                <div className={`bg-gradient-to-br ${steps[selectedStep - 1].theme.bg} ${steps[selectedStep - 1].theme.border} border-2 rounded-2xl p-8`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-14 h-14 ${steps[selectedStep - 1].theme.iconBg} rounded-xl flex items-center justify-center`}>
                      {(() => {
                        const Icon = steps[selectedStep - 1].icon;
                        return <Icon className={`w-7 h-7 ${steps[selectedStep - 1].theme.iconColor}`} />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-midnight">
                        {steps[selectedStep - 1].title}
                      </h3>
                      <p className="text-slate">{steps[selectedStep - 1].subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {steps[selectedStep - 1].description}
                  </p>
                  
                  <div className="space-y-3">
                    {steps[selectedStep - 1].features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <Check className={`w-5 h-5 ${steps[selectedStep - 1].theme.iconColor}`} />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Navigation Arrows */}
                  <div className="flex items-center justify-between mt-8">
                    <button
                      onClick={() => setSelectedStep(Math.max(1, selectedStep - 1))}
                      disabled={selectedStep === 1}
                      className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                        selectedStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-midnight'
                      }`}
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      <span>Previous</span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedStep(Math.min(3, selectedStep + 1))}
                      disabled={selectedStep === 3}
                      className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                        selectedStep === 3 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-midnight'
                      }`}
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Right: Mockup */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <StepMockup stepId={selectedStep} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-xl text-slate mb-2">Click any step above to explore</p>
                <p className="text-lg text-slate/70">See exactly how PostArc transforms your ideas into engaging LinkedIn posts</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile: Simple Vertical Layout */}
        <div className="md:hidden space-y-6">
          {steps.map((step) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: step.id * 0.1 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${step.theme.bg} ${step.theme.border} border-2 rounded-2xl p-6`}
            >
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