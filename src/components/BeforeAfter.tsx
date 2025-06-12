import { motion } from 'framer-motion';
import { X, Check, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export const BeforeAfter = () => {
  const beforeProblems = [
    "45 minutes lost to every post",
    "Voice feels off — or worse, ignored",
    "Zero engagement after all that effort",
    "Inconsistent posting weakens your credibility",
    "Sounding smart ≠ sounding like you",
    "You hesitate — and your ideas never get shared"
  ];

  const afterBenefits = [
    "10-second posts — polished and professional",
    "AI nails your voice every time",
    "3x engagement on average",
    "Effortless consistency = trusted thought leadership",
    "Content that attracts investors, clients, and hires",
    "Confidence to post — daily"
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-midnight">
            Before PostArc.{" "}
            <span className="relative">
              After PostArc
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon to-mint rounded-full"></div>
            </span>
          </h2>
          <p className="text-2xl text-slate max-w-3xl mx-auto mb-4">
            Your influence, multiplied
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 relative">
          {/* Connecting Arrow - Desktop Only */}
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="w-12 h-12 bg-neon/20 rounded-full flex items-center justify-center"
            >
              <ArrowRight className="w-6 h-6 text-neon" />
            </motion.div>
          </div>

          {/* Before - Problems */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="card-float p-8 border-slate-200 relative overflow-hidden bg-gradient-to-br from-red-50/50 to-white">
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
                    🔴 Result: Missed deals. Flat profile. Fading presence.
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
            <div className="card-float p-8 border-neon/30 relative overflow-hidden bg-gradient-to-br from-green-50/50 to-white shadow-[0_0_30px_rgba(0,255,194,0.1)]">
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
                    🟢 Result: Thought leadership. Growth. Authority.
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
