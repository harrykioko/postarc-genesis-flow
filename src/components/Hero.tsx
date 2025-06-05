import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Edit, Share } from "lucide-react";
import { useState } from "react";
import { DemoModal } from "./DemoModal";

export const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-neon/20 text-midnight border-neon/30">
            🚀 Generate LinkedIn posts in seconds
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Shape ideas.{" "}
            <span className="text-gradient">Share authority.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate mb-8 leading-relaxed max-w-3xl mx-auto">
            Generate expert-level posts in seconds with AI. Share confidently, grow your influence.
          </p>
          
          <div className="flex justify-center items-center mb-12">
            <Button
              onClick={() => setShowDemo(true)}
              className="btn-neon px-8 py-3 text-lg rounded-lg"
            >
              Try it now - Free
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-neon/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Edit className="w-6 h-6 text-neon" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">AI-Powered Writing</h3>
              <p className="text-slate">Generate engaging posts from topics or URLs in under 10 seconds</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-neon/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Share className="w-6 h-6 text-neon" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">One-Click Sharing</h3>
              <p className="text-slate">Share directly to LinkedIn with pre-filled, optimized content</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-neon/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowDown className="w-6 h-6 text-neon" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">Professional Templates</h3>
              <p className="text-slate">Choose from Consultant, Founder, VC, Sales, and HR styles</p>
            </div>
          </div>
        </div>
      </div>
      
      <DemoModal open={showDemo} onOpenChange={setShowDemo} />
    </section>
  );
};
