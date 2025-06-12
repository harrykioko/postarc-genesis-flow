import { motion } from "framer-motion";

export const ProcessStepsHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="max-w-5xl mx-auto px-6 pt-20 pb-12"
  >
    <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight text-center">
      Generate. Refine.{" "}
      <span className="bg-gradient-to-r from-[#B388F9] via-[#00FFC2] to-[#00D5FF] bg-clip-text text-transparent">
        Dominate LinkedIn
      </span>
    </h2>
    <p className="text-lg md:text-xl text-slate-600 font-normal mt-4 text-center max-w-3xl mx-auto font-inter">
      PostArc's AI-driven workflow transforms raw ideas into scroll-stopping content — without the overthinking.
    </p>
  </motion.div>
);
