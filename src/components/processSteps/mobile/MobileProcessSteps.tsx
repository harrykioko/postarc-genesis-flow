import { motion } from "framer-motion";

interface MobileProcessStepsProps {
  steps: any[];
}

export const MobileProcessSteps = ({ steps }: MobileProcessStepsProps) => (
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
        <div className="backdrop-blur-md bg-white/70 shadow-lg rounded-2xl border border-slate-100 p-6 overflow-hidden">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#00FFC2]/10 rounded-xl flex items-center justify-center">
                <step.icon className="w-6 h-6 text-[#00FFC2]" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-500">{step.stats.time} {step.stats.action}</p>
              </div>
            </div>
            <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {step.id}
            </div>
          </div>
          
          <p className="text-slate-600 mb-4 font-inter">{step.description}</p>
          
          {/* Mini mockup preview */}
          <div className="bg-slate-50/50 backdrop-blur-sm rounded-lg p-4 text-sm">
            {step.mockup.content}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);
