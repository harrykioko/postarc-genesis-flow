
import { Lightbulb, Sparkles, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProcessStepsProps {
  onTryNowClick: () => void;
}

export const ProcessSteps = ({ onTryNowClick }: ProcessStepsProps) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">
            How it works
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            From Blank page to Linkedin post in seconds
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Desktop: horizontal layout */}
          <div className="hidden md:flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex-1">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-midnight text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold text-midnight mb-2">Drop Your Idea</h3>
                <p className="text-slate text-center max-w-xs">
                  Any topic, article URL, or random thought that sparks inspiration
                </p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="flex-shrink-0 w-32 px-4">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>

            {/* Step 2 */}
            <div className="flex-1">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-midnight text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold text-midnight mb-2">AI Works Its Magic</h3>
                <p className="text-slate text-center max-w-xs">
                  Analyzes trends, crafts hooks, and optimizes for maximum engagement
                </p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="flex-shrink-0 w-32 px-4">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-neon rounded-full"></div>
            </div>

            {/* Step 3 */}
            <div className="flex-1">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-neon rounded-full flex items-center justify-center">
                    <Share2 className="w-12 h-12 text-midnight" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-midnight text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold text-midnight mb-2">Share & Shine</h3>
                <p className="text-slate text-center max-w-xs">
                  Copy, edit, or post directly to LinkedIn with one click
                </p>
              </div>
            </div>
          </div>

          {/* Mobile: vertical layout */}
          <div className="md:hidden space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-midnight text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-heading font-bold text-midnight mb-2">Drop Your Idea</h3>
              <p className="text-slate text-center max-w-xs">
                Any topic, article URL, or random thought that sparks inspiration
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-midnight text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-heading font-bold text-midnight mb-2">AI Works Its Magic</h3>
              <p className="text-slate text-center max-w-xs">
                Analyzes trends, crafts hooks, and optimizes for maximum engagement
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-neon rounded-full flex items-center justify-center">
                  <Share2 className="w-12 h-12 text-midnight" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-midnight text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-heading font-bold text-midnight mb-2">Share & Shine</h3>
              <p className="text-slate text-center max-w-xs">
                Copy, edit, or post directly to LinkedIn with one click
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Button
            onClick={onTryNowClick}
            className="btn-neon px-8 py-3 text-lg rounded-lg"
          >
            Try It Now
          </Button>
          <p className="text-sm text-slate mt-3">
            3 free posts • No signup required
          </p>
        </div>
      </div>
    </section>
  );
};
