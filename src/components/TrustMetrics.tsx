import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView, useMotionValue, animate } from 'framer-motion';
import { TrendingUp, Users, Star, Clock } from 'lucide-react';

export const TrustMetrics = () => {
  const metrics = [
    {
      value: 50000,
      display: "50K+",
      label: "Posts Created",
      icon: Users,
      description: "Professional content generated"
    },
    {
      value: 92,
      display: "92%",
      label: "Higher Engagement",
      icon: TrendingUp,
      description: "Average increase in likes"
    },
    {
      value: 4.9,
      display: "4.9/5",
      label: "Rating",
      icon: Star,
      description: "From satisfied users"
    },
    {
      value: 10,
      display: "10 sec",
      label: "Average",
      icon: Clock,
      description: "Time to generate posts"
    }
  ];

  // Count-up hook using Framer Motion's motionValue
  function useCountUp(target: number, inView: boolean, duration = 1.2) {
    const motionValue = useMotionValue(0);
    const [current, setCurrent] = useState(0);
    useEffect(() => {
      if (inView) {
        const controls = animate(motionValue, target, {
          duration,
          ease: 'easeOut',
          onUpdate: (v) => setCurrent(v)
        });
        return controls.stop;
      }
    }, [inView, target, duration, motionValue]);
    return Math.round(current);
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-midnight">
            Trusted by Professionals
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            Join thousands of professionals who trust PostArc for their LinkedIn success
          </p>
        </div>
        {/* Full-width, equal spacing KPI row */}
        <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-7xl mx-auto">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            // For count-up: only animate numbers, not text (e.g., 4.9/5, 10 sec)
            const isNumeric = typeof metric.value === 'number' && !isNaN(metric.value) && metric.display.match(/^\d/);
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: '-50px' });
            const animatedValue = isNumeric ? useCountUp(metric.value, inView) : null;
            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-1 min-w-[180px] text-center card-float p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg"
                aria-label={`${metric.value} ${metric.label}`}
              >
                <div className="w-12 h-12 bg-neon/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-neon" aria-hidden="true" />
                </div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-midnight mb-2" aria-live="polite">
                  {isNumeric ? (
                    <span>
                      {metric.value >= 1000
                        ? `${animatedValue.toLocaleString()}+`
                        : metric.label === 'Rating'
                        ? metric.display
                        : `${animatedValue}${metric.display.replace(/^[\d,.]+/, '')}`}
                    </span>
                  ) : (
                    metric.display
                  )}
                </div>
                <div className="text-base md:text-lg font-semibold text-midnight mb-1 opacity-80">
                  {metric.label}
                </div>
                <div className="text-sm text-slate">
                  {metric.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
