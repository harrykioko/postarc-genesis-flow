
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface ProcessStepsProps {
  onTryNowClick: () => void;
}

export const ProcessSteps = ({ onTryNowClick }: ProcessStepsProps) => {
  const [typewriterText, setTypewriterText] = useState("");
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fullText = "AI in healthcare transformation...";

  useEffect(() => {
    // Typewriter effect for Step 1
    let index = 0;
    const typewriterInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typewriterInterval);
        // Start Step 2 processing after typewriter finishes
        setTimeout(() => setShowProcessing(true), 500);
        // Show Step 3 success after processing
        setTimeout(() => {
          setShowProcessing(false);
          setShowSuccess(true);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typewriterInterval);
  }, []);

  return (
    <section className="py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            How It Works: From Blank Page to Viral Post in{' '}
            <span className="bg-gradient-to-r from-neon to-mint bg-clip-text text-transparent">
              60 Seconds
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how AI transforms your ideas into LinkedIn gold
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Animated Progress Line (Desktop Only) */}
          <div className="absolute top-[120px] left-[15%] right-[15%] h-1 hidden md:block">
            <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-neon rounded-full"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {/* STEP 1: Enter Your Topic */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                {/* Pulsing glow background */}
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                
                {/* Main circle */}
                <div className="relative w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                
                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-midnight text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">1</div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Drop Your Idea</h3>
              <p className="text-gray-600 mb-4 max-w-xs mx-auto">
                Any topic, article URL, or random thought that sparks inspiration
              </p>
              
              {/* Mini demo */}
              <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-xs mx-auto">
                <div className="text-sm text-gray-700 font-mono">
                  <span className="typing-animation">{typewriterText}</span>
                </div>
              </div>
            </div>

            {/* STEP 2: AI Processing */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                {/* Spinning rings */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 border-4 border-purple-300 rounded-full animate-spin"></div>
                  <div className="absolute inset-3 border-4 border-purple-400 rounded-full animate-spin-reverse"></div>
                </div>
                
                {/* Main circle with glow effect */}
                <div className="relative w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-midnight text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">2</div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-gray-900">AI Works Its Magic</h3>
              <p className="text-gray-600 mb-4 max-w-xs mx-auto">
                Analyzes trends, crafts hooks, and optimizes for maximum engagement
              </p>
              
              {/* Processing animation */}
              <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-xs mx-auto">
                {showProcessing ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-xs text-purple-600">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Analyzing trending topics...</span>
                    </div>
                    {/* Loading dots */}
                    <div className="flex justify-center gap-1">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Waiting to process...</div>
                )}
              </div>
            </div>

            {/* STEP 3: Share */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                {/* Success burst */}
                <div className="absolute inset-0 bg-neon rounded-full blur-2xl opacity-30 animate-pulse"></div>
                
                {/* Main circle */}
                <div className="relative w-28 h-28 bg-gradient-to-br from-neon to-mint rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-14 h-14 text-midnight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-midnight text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">3</div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Share & Shine</h3>
              <p className="text-gray-600 mb-4 max-w-xs mx-auto">
                Copy, edit, or post directly to LinkedIn with one click
              </p>
              
              {/* Success state */}
              <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-xs mx-auto">
                {showSuccess ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-600 font-medium">Ready in 10 seconds</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Awaiting completion...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={onTryNowClick}
            className="btn-neon px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Try It Now
          </button>
          <p className="text-sm text-slate mt-3">
            3 free posts • No signup required
          </p>
          
          {/* Trust indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              1,247 professionals online now
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              4.9/5 average rating
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
