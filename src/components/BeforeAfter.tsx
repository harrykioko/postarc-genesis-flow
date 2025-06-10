
import { motion } from 'framer-motion';
import { X, Check, AlertCircle, Sparkles } from 'lucide-react';

export const BeforeAfter = () => {
  const beforeProblems = [
    "Staring at blank page for 30+ minutes",
    "Struggling to find the right tone",
    "Posts get buried with low engagement",
    "Inconsistent posting schedule",
    "Content doesn't reflect expertise"
  ];

  const afterBenefits = [
    "Generate posts in under 10 seconds",
    "Perfect professional tone every time",
    "Higher engagement with optimized content",
    "Consistent, quality posting made easy",
    "Content that showcases your expertise"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">
            Transform Your LinkedIn Presence
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            See the difference PostArc makes for professionals like you
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Before - Problems */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-card p-8 rounded-xl border-2 border-red-100 relative overflow-hidden">
              {/* Subtle red glow effect */}
              <div className="absolute inset-0 bg-red-50/30 rounded-xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold text-midnight">
                    Without PostArc
                  </h3>
                </div>

                <div className="space-y-4">
                  {beforeProblems.map((problem, index) => (
                    <div key={index} className="flex items-start">
                      <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate leading-relaxed">{problem}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">
                    Result: Inconsistent posting, low engagement, missed opportunities
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* After - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-card p-8 rounded-xl border-2 border-green-100 relative overflow-hidden">
              {/* Subtle green glow effect */}
              <div className="absolute inset-0 bg-green-50/30 rounded-xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-neon/20 rounded-lg flex items-center justify-center mr-4">
                    <Sparkles className="w-6 h-6 text-neon" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold text-midnight">
                    With PostArc
                  </h3>
                </div>

                <div className="space-y-4">
                  {afterBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    Result: Consistent thought leadership, higher engagement, growing influence
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
