
import { motion } from 'framer-motion';
import { X, Check, AlertCircle, Sparkles } from 'lucide-react';

export const BeforeAfter = () => {
  const beforeProblems = [
    "Spending 45+ minutes crafting a single post",
    "Struggling to find your authentic professional voice",
    "Posts getting lost in the feed with minimal engagement",
    "Inconsistent posting hurting your thought leadership",
    "Content that doesn't showcase your true expertise",
    "Fear of posting because it might not sound professional"
  ];

  const afterBenefits = [
    "Generate polished posts in under 10 seconds",
    "AI matches your professional tone perfectly every time",
    "Optimized content that drives 3x higher engagement",
    "Consistent, quality posting builds your personal brand",
    "Content that positions you as an industry thought leader",
    "Confidence to share ideas and grow your influence daily"
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-midnight">
            Transform Your LinkedIn Presence
          </h2>
          <p className="text-xl text-slate max-w-3xl mx-auto mb-4">
            See the dramatic difference PostArc makes for busy professionals
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-neon to-mint mx-auto rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Before - Problems */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-card p-8 rounded-2xl border-2 border-red-100 relative overflow-hidden bg-gradient-to-br from-red-50/50 to-white">
              {/* Enhanced visual effect */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-red-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                    <AlertCircle className="w-7 h-7 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-midnight mb-1">
                      Without PostArc
                    </h3>
                    <p className="text-red-600 font-medium">The LinkedIn struggle is real</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {beforeProblems.map((problem, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <X className="w-5 h-5 text-red-500 mr-4 mt-1 flex-shrink-0" />
                      <span className="text-slate leading-relaxed font-medium">{problem}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-5 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-red-800 font-semibold text-center">
                    Result: Missed opportunities, inconsistent presence, declining influence
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
            <div className="glass-card p-8 rounded-2xl border-2 border-green-100 relative overflow-hidden bg-gradient-to-br from-green-50/50 to-white">
              {/* Enhanced visual effect */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon to-mint"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-neon/20 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                    <Sparkles className="w-7 h-7 text-neon" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-midnight mb-1">
                      With PostArc
                    </h3>
                    <p className="text-neon font-medium">LinkedIn success made simple</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {afterBenefits.map((benefit, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Check className="w-5 h-5 text-green-500 mr-4 mt-1 flex-shrink-0" />
                      <span className="text-slate leading-relaxed font-medium">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-5 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-green-800 font-semibold text-center">
                    Result: Consistent thought leadership, exponential growth, industry recognition
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-heading font-bold text-midnight mb-4">
              Ready to transform your LinkedIn presence?
            </h3>
            <p className="text-slate text-lg">
              Join thousands of professionals who've already made the switch to effortless content creation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
