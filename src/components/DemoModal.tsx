
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Linkedin, Sparkles } from "lucide-react";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("consultant");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [demoCount, setDemoCount] = useState(0);

  const templates = [
    { id: "consultant", name: "Consultant", description: "Professional and authoritative tone" },
    { id: "founder", name: "Founder", description: "Entrepreneurial and visionary" },
    { id: "sales", name: "Sales", description: "Engaging and relationship-focused" },
  ];

  const samplePost = `🚀 The future of professional content creation is here.

After years of struggling to maintain a consistent LinkedIn presence while running my consultancy, I discovered something game-changing: AI-powered content generation that actually understands professional context.

Here's what I learned:

✅ Authenticity doesn't mean doing everything manually
✅ Consistency beats perfection every time  
✅ The right tools amplify your expertise, they don't replace it

The professionals who embrace AI as a creative partner will build stronger personal brands while reclaiming their time.

What's your take on AI in professional content creation?

#ThoughtLeadership #AI #ProfessionalGrowth`;

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedPost(samplePost);
      setIsGenerating(false);
      setDemoCount(prev => prev + 1);
    }, 2000);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedPost);
  };

  const handleShare = () => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&text=${encodeURIComponent(generatedPost)}`;
    window.open(linkedinUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-heading">Try PostArc Demo</DialogTitle>
            <Badge variant="secondary" className="bg-neon/20 text-midnight">
              {3 - demoCount} tries remaining
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
              disabled={!input.trim() || isGenerating || demoCount >= 3}
              className="w-full btn-neon py-3"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
                  <span>Generating post...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Post</span>
                </div>
              )}
            </Button>
            
            {demoCount >= 3 && (
              <div className="glass-card p-4 rounded-lg text-center">
                <h4 className="font-semibold text-midnight mb-2">Demo limit reached</h4>
                <p className="text-sm text-slate mb-3">
                  Sign up to get 5 free posts per month, or upgrade to Pro for unlimited generation.
                </p>
                <Button className="btn-neon w-full" onClick={() => onOpenChange(false)}>
                  Get Started Free
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
              </div>
            ) : (
              <div className="glass-card p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-neon" />
                </div>
                <h4 className="font-semibold text-midnight mb-2">Your generated post will appear here</h4>
                <p className="text-slate text-sm">Enter a topic or URL and click generate to see the magic happen</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
