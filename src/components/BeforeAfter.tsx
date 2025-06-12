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
    <section className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div
          className="flex flex-col lg:flex-row items-stretch justify-center gap-y-8 lg:gap-y-0 lg:gap-x-12 relative"
        >
          {/* Without PostArc Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 60, damping: 18 }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex-1 bg-white/40 backdrop-blur-lg border border-white/20 border-t-[6px] border-t-[#FF5E5E] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl p-8 relative overflow-hidden"
          >
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
          </motion.div>

          {/* Connector Arrow Placeholder (to be animated after both cards) */}
          <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {/* TODO: Animated chevron/arrow will be implemented here */}
          </div>

          {/* With PostArc Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex-1 bg-white/40 backdrop-blur-lg border border-white/20 border-t-[6px] border-t-[#00FFC2] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl p-8 relative overflow-hidden lg:-rotate-3 lg:shadow-[0_0_40px_8px_#00FFC2] transition-transform duration-300"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};
