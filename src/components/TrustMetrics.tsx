
import { motion } from 'framer-motion';
import { TrendingUp, Users, Star, Clock } from 'lucide-react';

export const TrustMetrics = () => {
  const metrics = [
    {
      value: "50K+",
      label: "Posts Created",
      icon: Users,
      description: "Professional content generated"
    },
    {
      value: "92%",
      label: "Higher Engagement",
      icon: TrendingUp,
      description: "Average increase in likes"
    },
    {
      value: "4.9/5",
      label: "Rating",
      icon: Star,
      description: "From satisfied users"
    },
    {
      value: "10 sec",
      label: "Average",
      icon: Clock,
      description: "Time to generate posts"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-slate-50 to-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center glass-card p-6 rounded-xl"
              >
                <div className="w-12 h-12 bg-neon/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-neon" />
                </div>
                <div className="text-3xl md:text-4xl font-heading font-bold text-midnight mb-2">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-midnight mb-1">
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
