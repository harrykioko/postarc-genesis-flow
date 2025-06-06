
import React, { useEffect, useState } from 'react';
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react';

const Success = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Redirect to dashboard
          window.location.href = '/dashboard';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Get session ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  return (
    <div className="min-h-screen bg-gradient-brand flex items-center justify-center p-4">
      <div className="max-w-lg w-full animate-fade-in">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            {/* Animated success circle */}
            <div className="absolute inset-0 bg-neon rounded-full animate-pulse"></div>
            <div className="relative bg-neon rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
              <Check className="w-12 h-12 text-midnight animate-bounce" />
            </div>
            {/* Sparkles around the circle */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-neon animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-mint animate-pulse delay-150" />
            <Zap className="absolute top-0 -left-4 w-5 h-5 text-neon animate-pulse delay-300" />
          </div>

          <h1 className="text-4xl font-heading font-bold text-midnight mb-3">
            🎉 Welcome to Pro!
          </h1>
          
          <p className="text-xl text-slate mb-6 font-body">
            Your payment was successful and your account has been upgraded
          </p>
        </div>

        {/* Features unlocked */}
        <div className="glass-card-strong rounded-2xl p-6 mb-8 border border-neon/30 shadow-xl animate-slide-up">
          <h2 className="text-lg font-heading font-semibold text-midnight mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon" />
            You now have access to:
          </h2>
          
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-neon rounded-full"></div>
              <span className="text-midnight font-body"><strong>Unlimited</strong> AI post generation</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-neon rounded-full"></div>
              <span className="text-midnight font-body"><strong>Priority</strong> AI processing</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-neon rounded-full"></div>
              <span className="text-midnight font-body"><strong>Complete</strong> post history</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-neon rounded-full"></div>
              <span className="text-midnight font-body"><strong>Advanced</strong> URL scraping</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-neon rounded-full"></div>
              <span className="text-midnight font-body"><strong>Custom</strong> brand voice</span>
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={handleGoToDashboard}
            className="w-full btn-neon py-4 px-6 rounded-xl font-heading font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group transition-all focus-enhanced"
          >
            Start Creating Unlimited Posts
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-sm text-slate font-body">
            Redirecting automatically in <span className="font-semibold text-neon">{countdown}</span> seconds...
          </p>
          
          {sessionId && (
            <p className="text-xs text-slate/60 mt-4 font-body">
              Payment confirmation: {sessionId.substring(0, 20)}...
            </p>
          )}
        </div>

        {/* Support note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate font-body">
            Questions about your Pro subscription?{' '}
            <a 
              href="mailto:support@postarc.ai" 
              className="text-neon hover:underline font-medium focus-enhanced"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
