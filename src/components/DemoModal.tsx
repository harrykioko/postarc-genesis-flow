import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Linkedin, Sparkles, AlertCircle } from "lucide-react";

// Fallback toast function if not available
const toast = (params) => {
  console.log('Toast:', params.title, params.description);
  // You can replace this with alert() if needed for testing
  // alert(`${params.title}: ${params.description}`);
};

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

// Get demo usage from localStorage
function getDemoUsage() {
  const usage = localStorage.getItem('postarc_demo_usage');
  if (!usage || usage === 'undefined' || usage === 'null') {
    return { used: 0, limit: 3, remaining: 3 };
  }
  try {
    return JSON.parse(usage);
  } catch (error) {
    console.log('Error parsing demo usage, resetting:', error);
    return { used: 0, limit: 3, remaining: 3 };
  }
}

// Save demo usage to localStorage
function saveDemoUsage(usage) {
  try {
    localStorage.setItem('postarc_demo_usage', JSON.stringify(usage));
  } catch (error) {
    console.log('Error saving demo usage:', error);
  }
}

export const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Consultant");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [demoUsage, setDemoUsage] = useState(getDemoUsage());

  // Load demo usage when modal opens
  useEffect(() => {
    if (open) {
      setDemoUsage(getDemoUsage());
    }
  }, [open]);

  const templates = [
    { id: "Consultant", name: "Consultant", description: "Professional and authoritative tone" },
    { id: "Founder", name: "Founder", description: "Entrepreneurial and visionary" },
    { id: "Sales", name: "Sales", description: "Engaging and relationship-focused" },
    { id: "VC", name: "VC", description: "Analytical and forward-thinking" },
    { id: "HR", name: "HR", description: "Empathetic and people-focused" },
  ];

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a topic or paste a URL",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('https://obmrbvozmozvvxirrils.supabase.co/functions/v1/demoGenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-session': getDemoSessionId()
        },
        body: JSON.stringify({
          input: input.trim(),
          template: selectedTemplate
        })
      });

      const data = await response.json();

      if (data.error === 'demo_limit_exceeded') {
        // Handle limit exceeded
        toast({
          title: "Demo limit reached! 🎉",
          description: data.message,
        });
        
        // Update local usage to reflect limit
        const newUsage = { used: 3, limit: 3, remaining: 0 };
        setDemoUsage(newUsage);
        saveDemoUsage(newUsage);
        return;
      }

      if (data.error) {
        toast({
          title: "Generation failed",
          description: data.message || "Please try again",
          variant: "destructive"
        });
        return;
      }

      // Success!
      setGeneratedPost(data.post);
      
      // Update usage tracking
      const newUsage = data.demo_usage;
      setDemoUsage(newUsage);
      saveDemoUsage(newUsage);

      // Show success message
      if (newUsage.remaining > 0) {
        toast({
          title: "Post generated! ✨",
          description: `${newUsage.remaining} free ${newUsage.remaining === 1 ? 'try' : 'tries'} remaining`,
        });
      } else {
        toast({
          title: "Amazing! That was your last free try",
          description: "Sign up now for 5 more posts every month!",
        });
      }

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Network error",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      toast({
        title: "Copied!",
        description: "Post copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy manually",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&text=${encodeURIComponent(generatedPost)}`;
    window.open(linkedinUrl, '_blank');
    
    // Track share action
    toast({
      title: "Opening LinkedIn",
      description: "Your post is ready to share!"
    });
  };

  const canGenerate = demoUsage.remaining > 0;
  const isAtLimit = demoUsage.remaining === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-heading">Try PostArc Demo</DialogTitle>
            <Badge variant="secondary" className="bg-neon/20 text-midnight">
              {demoUsage.remaining} tries remaining
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="demo-input" className="text-base font-semibold">
                Enter a topic or paste a URL
              </Label>
              <Input
                id="demo-input"
                placeholder="e.g., 'AI in professional services' or paste an article URL"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mt-2"
              />
              {input.startsWith('http') && (
                <p className="text-xs text-slate mt-1">
                  🔗 We'll analyze this article and create a LinkedIn post about it
                </p>
              )}
            </div>
            
            <div>
              <Label className="text-base font-semibold mb-3 block">Choose your style</Label>
              <div className="grid gap-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-neon bg-neon/10'
                        : 'border-gray-200 hover:border-neon/50'
                    }`}
                  >
                    <div className="font-semibold text-midnight">{template.name}</div>
                    <div className="text-sm text-slate">{template.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={!input.trim() || isGenerating || !canGenerate}
              className="w-full btn-neon py-3"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
                  <span>Generating post...</span>
                </div>
              ) : !canGenerate ? (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Sign up for more</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Post ({demoUsage.remaining} left)</span>
                </div>
              )}
            </Button>
            
            {isAtLimit && (
              <div className="glass-card p-4 rounded-lg text-center">
                <h4 className="font-semibold text-midnight mb-2">🎉 Impressed with the results?</h4>
                <p className="text-sm text-slate mb-3">
                  Sign up to get 5 free posts per month, or upgrade to Pro for unlimited generation.
                </p>
                <Button className="btn-neon w-full" onClick={() => onOpenChange(false)}>
                  Get Started Free - No Credit Card Required
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {generatedPost ? (
              <div className="glass-card-strong p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-midnight">Generated Post</h4>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleShare}
                      className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white flex items-center space-x-1"
                    >
                      <Linkedin className="w-3 h-3" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line">
                  {generatedPost}
                </div>
                
                {/* Encouraging message after generation */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 font-medium">
                      This post is ready to share on LinkedIn!
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-neon" />
                </div>
                <h4 className="font-semibold text-midnight mb-2">Your generated post will appear here</h4>
                <p className="text-slate text-sm">Enter a topic or URL and click generate to see the magic happen</p>
                
                {demoUsage.used > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      You've generated {demoUsage.used} demo post{demoUsage.used === 1 ? '' : 's'}!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};