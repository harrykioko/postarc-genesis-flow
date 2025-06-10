
import { Lightbulb, Sparkles, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProcessStepsProps {
  onTryNowClick: () => void;
}

export const ProcessSteps = ({ onTryNowClick }: ProcessStepsProps) => {
  const steps = [
    {
      icon: Lightbulb,
      title: "Drop Your Idea",
      description: "Any topic, article URL, or random thought that sparks inspiration"
    },
    {
      icon: Sparkles,
      title: "AI Works Its Magic",
      description: "Analyzes trends, crafts hooks, and optimizes for maximum engagement"
    },
    {
      icon: Share2,
      title: "Share & Shine",
      description: "Copy, edit, or post directly to LinkedIn with one click"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">
            How It Works: From Blank Page to LinkedIn Post in Seconds
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            Watch how AI transforms your ideas into LinkedIn gold
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-center max-w-xs mx-auto">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white rounded-full shadow-lg border-2 border-neon/20 flex items-center justify-center">
                        <IconComponent className="w-10 h-10 text-midnight" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-midnight text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-heading font-semibold text-midnight mt-6 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate text-sm">
                      {step.description}
                    </p>
                  </div>

                  {/* Connecting line - only show between steps on desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex items-center flex-1 px-4 absolute top-10 left-1/2 w-full">
                      <div className="h-0.5 w-full bg-slate/20"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-16">
          <Button
            onClick={onTryNowClick}
            className="btn-neon px-8 py-3 text-lg rounded-lg"
          >
            Try It Now
          </Button>
          <p className="text-sm text-slate mt-2">
            3 free posts • No signup required
          </p>
        </div>
      </div>
    </section>
  );
};
