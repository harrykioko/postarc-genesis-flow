
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";

export const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-2xl h-96">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-purple-600/10 rounded-3xl blur-xl" />
      
      {/* Post Card 1 - Top Left */}
      <div className="absolute top-0 left-4 w-72 bg-white/80 backdrop-blur-lg rounded-xl border border-white/50 shadow-xl shadow-neon/10 p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-midnight to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            JS
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-midnight text-sm">Jessica Smith</h4>
            <p className="text-slate text-xs">Founder & CEO</p>
          </div>
        </div>
        <p className="text-midnight text-sm mb-3 leading-relaxed">
          Just closed our biggest deal ever! Here's the 3-step framework that made it happen...
        </p>
        <div className="flex items-center gap-4 text-slate">
          <div className="flex items-center gap-1 text-xs">
            <Heart className="w-3 h-3" />
            <span>847</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <MessageCircle className="w-3 h-3" />
            <span>92</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Repeat2 className="w-3 h-3" />
            <span>156</span>
          </div>
        </div>
      </div>

      {/* Post Card 2 - Center Right */}
      <div className="absolute top-16 right-0 w-80 bg-white/90 backdrop-blur-lg rounded-xl border border-white/60 shadow-xl shadow-purple-600/10 p-4 transform rotate-2 hover:rotate-0 transition-transform duration-300">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neon to-mint rounded-full flex items-center justify-center text-midnight text-sm font-bold">
            MR
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-midnight text-sm">Mike Rodriguez</h4>
            <p className="text-slate text-xs">Sales Director</p>
          </div>
        </div>
        <p className="text-midnight text-sm mb-3 leading-relaxed">
          The mindset shift that 10x'd my sales results. Most people get this completely wrong...
        </p>
        <div className="flex items-center gap-4 text-slate">
          <div className="flex items-center gap-1 text-xs">
            <Heart className="w-3 h-3" />
            <span>1.2k</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <MessageCircle className="w-3 h-3" />
            <span>167</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Repeat2 className="w-3 h-3" />
            <span>234</span>
          </div>
        </div>
      </div>

      {/* Post Card 3 - Bottom Center */}
      <div className="absolute bottom-8 left-8 w-76 bg-white/85 backdrop-blur-lg rounded-xl border border-white/55 shadow-xl shadow-midnight/10 p-4 transform rotate-1 hover:rotate-0 transition-transform duration-300">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-midnight rounded-full flex items-center justify-center text-white text-sm font-bold">
            AL
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-midnight text-sm">Alex Liu</h4>
            <p className="text-slate text-xs">Strategy Consultant</p>
          </div>
        </div>
        <p className="text-midnight text-sm mb-3 leading-relaxed">
          Why I stopped pitching and started storytelling. The results speak for themselves...
        </p>
        <div className="flex items-center gap-4 text-slate">
          <div className="flex items-center gap-1 text-xs">
            <Heart className="w-3 h-3" />
            <span>956</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <MessageCircle className="w-3 h-3" />
            <span>134</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Repeat2 className="w-3 h-3" />
            <span>198</span>
          </div>
        </div>
      </div>

      {/* Floating engagement indicators */}
      <div className="absolute top-20 right-16 bg-neon/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-midnight border border-neon/30">
        🔥 Viral
      </div>
      
      <div className="absolute bottom-20 left-20 bg-purple-600/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-midnight border border-purple-600/30">
        💡 High Engagement
      </div>
    </div>
  );
};
