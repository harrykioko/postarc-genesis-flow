
import { Button } from "@/components/ui/button";
import { Edit, Palette, Share } from 'lucide-react';

interface ProcessStepsProps {
  onTryNowClick: () => void;
}

export const ProcessSteps = ({ onTryNowClick }: ProcessStepsProps) => {
  const steps = [
    {
      number: 1,
      title: "Enter Your Topic",
      description: "Share an idea, paste a URL, or describe what you want to post about",
      icon: Edit,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: 2,
      title: "Choose Your Style",
      description: "Select from Consultant, Founder, VC, Sales, or HR templates",
      icon: Palette,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: 3,
      title: "Share on LinkedIn",
      description: "Get your polished post in seconds, ready to copy and share",
      icon: Share,
      color: "from-neon to-mint"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">
            Create Your First Post in 60 Seconds
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            Our simple 3-step process turns your ideas into professional LinkedIn content
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number} className="text-center relative">
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-slate/30 to-slate/30 z-0" />
                  )}
                  
                  {/* Step Circle */}
                  <div className="relative z-10 mb-6">
                    <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}>
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-midnight" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-midnight text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <h3 className="text-xl font-heading font-semibold mb-3 text-midnight">
                    {step.title}
                  </h3>
                  <p className="text-slate leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              onClick={onTryNowClick}
              className="btn-neon px-8 py-3 text-lg rounded-lg transform hover:scale-105 transition-all duration-200"
            >
              Try It Now - Free
            </Button>
            <p className="text-sm text-slate mt-3">
              No signup required • See results instantly
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
