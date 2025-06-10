
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, TrendingUp, Clock, ChevronRight, Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { DemoModal } from "./DemoModal";
import { AuthModal } from "./AuthModal";
import { PricingModal } from "./PricingModal";

export const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const handleSignUpFromDemo = () => {
    setShowAuth(true);
  };

  const handlePricingFromDemo = () => {
    setShowDemo(false);
    setShowPricing(true);
  };

  const handleAuthFromPricing = () => {
    setShowAuth(true);
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <Badge className="bg-gradient-to-r from-neon/20 to-mint/20 text-midnight border-0 px-4 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  1,247 posts created today
                </Badge>
                <Badge variant="outline" className="border-slate-300">
                  <Clock className="w-3 h-3 mr-1" />
                  10 sec average
                </Badge>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                <span className="relative inline-block">
                  Shape ideas
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 6C5 6 50 2 150 6C250 10 295 6 295 6"
                      stroke="#00FFC2"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                .{" "}
                <span className="text-gradient">Share authority.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Turn your expertise into LinkedIn posts that get 92% more engagement. No writing skills needed.
              </p>
              
              <div className="flex flex-col items-center lg:items-start mb-8">
                <button
                  onClick={() => setShowDemo(true)}
                  className="btn-neon px-10 py-5 text-xl font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mb-4"
                >
                  Try It Now
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-2">
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b1-5?w=32&h=32&fit=crop&crop=face" />
                      <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" />
                      <AvatarFallback>U2</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face" />
                      <AvatarFallback>U3</AvatarFallback>
                    </Avatar>
                    <div className="w-8 h-8 bg-neon text-midnight rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">
                      +2K
                    </div>
                  </div>
                  <span className="text-sm text-slate font-medium">+2,341 creating now</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate">
                  <span className="flex items-center gap-1">✓ 3 free posts</span>
                  <span className="flex items-center gap-1">✓ No credit card</span>
                  <span className="flex items-center gap-1">✓ 30 seconds to start</span>
                </div>
              </div>
            </div>

            {/* Right Column - LinkedIn Post Preview (Desktop Only) */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-96 bg-white rounded-lg border border-gray-200 shadow-lg p-6">
                  {/* LinkedIn Post Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">John Smith</h3>
                        <span className="text-blue-600 text-sm">• 1st</span>
                      </div>
                      <p className="text-sm text-gray-600">Senior Marketing Director at TechCorp</p>
                      <p className="text-xs text-gray-500">2m • 🌐</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-900 leading-relaxed">
                      Just discovered the power of AI in content creation! 🚀
                      <br /><br />
                      What used to take me hours now takes seconds. The engagement on my posts has increased by 92% since I started using AI-generated content.
                      <br /><br />
                      The future of content is here, and it's incredible.
                    </p>
                  </div>

                  {/* Engagement */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>127 reactions</span>
                      <span>24 comments • 8 reposts</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 py-1 px-2 rounded">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">Like</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 py-1 px-2 rounded">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Comment</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 py-1 px-2 rounded">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Repost</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute -top-4 -right-4 bg-neon text-midnight px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  10 seconds
                </div>
                <div className="absolute -bottom-4 -left-4 bg-midnight text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  AI Generated
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bounce Animation to Guide Users Down */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-8 bg-neon/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-neon/30">
          <ChevronDown className="w-4 h-4 text-neon" />
        </div>
      </div>
      
      <DemoModal 
        open={showDemo} 
        onOpenChange={setShowDemo}
        onSignUpClick={handleSignUpFromDemo}
        onPricingClick={handlePricingFromDemo}
      />
      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onAuthClick={handleAuthFromPricing}
        currentUsage={3}
        limit={3}
        resetDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
      />
    </section>
  );
};
