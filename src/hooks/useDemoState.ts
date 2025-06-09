
import { useState, useEffect } from "react";

interface DemoUsage {
  used: number;
  limit: number;
  remaining: number;
}

// Generate or get demo session ID
function getDemoSessionId() {
  let sessionId = localStorage.getItem('postarc_demo_session');
  if (!sessionId) {
    sessionId = 'demo_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('postarc_demo_session', sessionId);
    console.log('🆔 Generated new demo session ID:', sessionId);
  } else {
    console.log('🆔 Using existing demo session ID:', sessionId);
  }
  return sessionId;
}

// Get demo usage from localStorage with better error handling
function getDemoUsage(): DemoUsage {
  try {
    const usage = localStorage.getItem('postarc_demo_usage');
    console.log('📊 Raw usage from localStorage:', usage);
    
    if (!usage || usage === 'undefined' || usage === 'null') {
      console.log('📊 No valid usage found, returning default');
      return { used: 0, limit: 3, remaining: 3 };
    }
    
    const parsed = JSON.parse(usage);
    console.log('📊 Parsed usage:', parsed);
    
    // Ensure the parsed object has all required properties
    if (typeof parsed.remaining !== 'number' || typeof parsed.used !== 'number' || typeof parsed.limit !== 'number') {
      console.log('📊 Invalid demo usage format, resetting');
      return { used: 0, limit: 3, remaining: 3 };
    }
    
    console.log('📊 Valid usage loaded:', parsed);
    return parsed;
  } catch (error) {
    console.log('📊 Error parsing demo usage, resetting:', error);
    return { used: 0, limit: 3, remaining: 3 };
  }
}

// Save demo usage to localStorage
function saveDemoUsage(usage: DemoUsage) {
  try {
    console.log('💾 Saving demo usage:', usage);
    localStorage.setItem('postarc_demo_usage', JSON.stringify(usage));
  } catch (error) {
    console.log('💾 Error saving demo usage:', error);
  }
}

export const useDemoState = (open: boolean) => {
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Consultant");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [demoUsage, setDemoUsage] = useState(() => {
    const usage = getDemoUsage();
    console.log('🎭 Initial demo usage state:', usage);
    return usage;
  });

  // Reset and load demo usage when modal opens/closes
  useEffect(() => {
    if (open) {
      console.log('🔄 Demo modal opened - loading fresh state');
      const usage = getDemoUsage();
      console.log('🔄 Loading demo usage:', usage);
      setDemoUsage(usage);
      
      // Clear any previous generated post when opening
      console.log('🧹 Clearing previous generated post');
      setGeneratedPost("");
      setIsGenerating(false);
      
      // Clear input for fresh start
      setInput("");
    } else {
      console.log('🔄 Demo modal closed - clearing state');
      // Clear state when modal closes
      setGeneratedPost("");
      setIsGenerating(false);
    }
  }, [open]);

  const updateDemoUsage = (newUsage: DemoUsage) => {
    console.log('🔄 Updating demo usage from:', demoUsage, 'to:', newUsage);
    setDemoUsage(newUsage);
    saveDemoUsage(newUsage);
  };

  const clearGeneratedPost = () => {
    console.log('🧹 Clearing generated post via clearGeneratedPost');
    setGeneratedPost("");
  };

  // Debug current state
  useEffect(() => {
    console.log('🎭 Demo state updated:', {
      input: input.length > 0 ? `"${input.substring(0, 20)}..."` : 'empty',
      selectedTemplate,
      isGenerating,
      generatedPost: generatedPost.length > 0 ? `${generatedPost.length} characters` : 'empty',
      demoUsage
    });
  }, [input, selectedTemplate, isGenerating, generatedPost, demoUsage]);

  return {
    input,
    setInput,
    selectedTemplate,
    setSelectedTemplate,
    isGenerating,
    setIsGenerating,
    generatedPost,
    setGeneratedPost,
    clearGeneratedPost,
    demoUsage,
    updateDemoUsage,
    getDemoSessionId,
  };
};
