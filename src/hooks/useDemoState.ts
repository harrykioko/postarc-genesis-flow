
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
  }
  return sessionId;
}

// Get demo usage from localStorage with better error handling
function getDemoUsage(): DemoUsage {
  try {
    const usage = localStorage.getItem('postarc_demo_usage');
    if (!usage || usage === 'undefined' || usage === 'null') {
      return { used: 0, limit: 3, remaining: 3 };
    }
    const parsed = JSON.parse(usage);
    // Ensure the parsed object has all required properties
    if (typeof parsed.remaining !== 'number' || typeof parsed.used !== 'number' || typeof parsed.limit !== 'number') {
      console.log('Invalid demo usage format, resetting');
      return { used: 0, limit: 3, remaining: 3 };
    }
    return parsed;
  } catch (error) {
    console.log('Error parsing demo usage, resetting:', error);
    return { used: 0, limit: 3, remaining: 3 };
  }
}

// Save demo usage to localStorage
function saveDemoUsage(usage: DemoUsage) {
  try {
    localStorage.setItem('postarc_demo_usage', JSON.stringify(usage));
  } catch (error) {
    console.log('Error saving demo usage:', error);
  }
}

export const useDemoState = (open: boolean) => {
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Consultant");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [demoUsage, setDemoUsage] = useState(() => getDemoUsage());

  // Load demo usage when modal opens
  useEffect(() => {
    if (open) {
      const usage = getDemoUsage();
      console.log('Loading demo usage:', usage);
      setDemoUsage(usage);
    }
  }, [open]);

  const updateDemoUsage = (newUsage: DemoUsage) => {
    console.log('Updating demo usage to:', newUsage);
    setDemoUsage(newUsage);
    saveDemoUsage(newUsage);
  };

  return {
    input,
    setInput,
    selectedTemplate,
    setSelectedTemplate,
    isGenerating,
    setIsGenerating,
    generatedPost,
    setGeneratedPost,
    demoUsage,
    updateDemoUsage,
    getDemoSessionId,
  };
};
