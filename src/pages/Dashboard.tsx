
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Copy, Linkedin, Sparkles, History, Settings, User, ClipboardCopy } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("consultant");
  const [useEmojis, setUseEmojis] = useState(true);
  const [useHashtags, setUseHashtags] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [quota, setQuota] = useState({ used: 2, total: 5 });
  const [showSpark, setShowSpark] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  const templates = [
    { id: "consultant", name: "Consultant", description: "Professional and authoritative tone", color: "bg-blue-500" },
    { id: "founder", name: "Founder", description: "Entrepreneurial and visionary", color: "bg-purple-500" },
    { id: "vc", name: "VC", description: "Investment-focused insights", color: "bg-green-500" },
    { id: "sales", name: "Sales", description: "Engaging and relationship-focused", color: "bg-orange-500" },
    { id: "hr", name: "HR", description: "People and culture focused", color: "bg-pink-500" },
  ];

  const [recentPosts, setRecentPosts] = useState([
    { id: 1, preview: "The future of remote work is here. After 3 years of...", date: "2 hours ago" },
    { id: 2, preview: "5 lessons I learned from failing fast in startups...", date: "1 day ago" },
    { id: 3, preview: "Why authentic leadership matters more than ever...", date: "3 days ago" },
  ]);

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
    setShowSpark(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedPost(samplePost);
      setIsGenerating(false);
      setQuota(prev => ({ ...prev, used: prev.used + 1 }));
      setShowPulse(true);
      
      // Add new post to recent list
      const newPost = {
        id: Date.now(),
        preview: input.substring(0, 50) + "...",
        date: "Just now"
      };
      setRecentPosts(prev => [newPost, ...prev.slice(0, 2)]);
      
      setTimeout(() => setShowPulse(false), 1000);
    }, 2000);
    
    setTimeout(() => setShowSpark(false), 800);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const handleShare = () => {
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&text=${encodeURIComponent(generatedPost)}`;
    window.open(linkedinUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-animated bg-[length:100%_200%] animate-bgMove motion-reduce:animate-none motion-reduce:bg-gradient-brand">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/4c54b1f5-c3f4-4d70-9a61-eca611f2e011.png" 
              alt="PostArc Logo" 
              className="h-8 w-auto object-contain"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Badge variant="outline" className="border-neon text-midnight">
                {quota.used}/{quota.total} posts used
              </Badge>
              {showPulse && (
                <div className="absolute inset-0 rounded-full border-2 border-neon animate-pulse-ring pointer-events-none" />
              )}
            </div>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              John Doe
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
              <CardHeader>
                <CardTitle className="font-heading text-midnight">Create Your Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="post-input" className="text-base font-semibold">
                    Enter a topic or paste a URL
                  </Label>
                  <Input
                    id="post-input"
                    placeholder="e.g., 'AI in professional services' or paste an article URL"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="mt-2 border-slate/20 focus:ring-mint/40"
                    aria-label="Post topic input"
                  />
                </div>
                
                <div>
                  <Label className="text-base font-semibold mb-3 block">Choose your style</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:bg-mint/5 ${
                          selectedTemplate === template.id
                            ? 'border-neon bg-mint/10 shadow-lg border-l-4 border-l-neon'
                            : 'border-slate/20 hover:border-neon/50'
                        }`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${template.name} template`}
                      >
                        <div className={`w-3 h-3 rounded-full ${template.color} mb-2 transition-all duration-120`} />
                        <div className="font-semibold text-midnight text-sm">{template.name}</div>
                        <div className="text-xs text-slate">{template.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="emojis"
                        checked={useEmojis}
                        onCheckedChange={setUseEmojis}
                        className="data-[state=checked]:bg-mint"
                        aria-label="Include emojis toggle"
                      />
                      <Label htmlFor="emojis">Include emojis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hashtags"
                        checked={useHashtags}
                        onCheckedChange={setUseHashtags}
                        className="data-[state=checked]:bg-mint"
                        aria-label="Include hashtags toggle"
                      />
                      <Label htmlFor="hashtags">Include hashtags</Label>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Button
                      onClick={handleGenerate}
                      disabled={!input.trim() || isGenerating || quota.used >= quota.total}
                      className="bg-neon text-midnight hover:bg-neon/90 px-6 transform hover:scale-105 active:scale-110 transition-transform duration-100"
                      aria-label="Generate post content"
                    >
                      {isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
                          <span>Generating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Generate</span>
                        </div>
                      )}
                    </Button>
                    {showSpark && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg animate-spark-float pointer-events-none">
                        ✨
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Post */}
            {generatedPost && (
              <Card className="bg-white border-0 rounded-xl shadow-xl hover:ring-1 hover:ring-mint/10 transition-all duration-200 animate-slide-in-item">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-midnight">Generated Post</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(generatedPost)}
                        className="flex items-center space-x-1 border-midnight hover:bg-mint hover:text-midnight"
                        aria-label="Copy generated post"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleShare}
                        className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white flex items-center space-x-1"
                        aria-label="Share to LinkedIn"
                      >
                        <Linkedin className="w-3 h-3" />
                        <span>Share</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate/5 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line">
                    {generatedPost}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:order-last order-first">
            {/* Quota Status */}
            <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-midnight mb-2">
                    {quota.total - quota.used} / {quota.total}
                  </div>
                  <div className="text-slate mb-4 font-medium">{quota.used} / {quota.total} posts used this month</div>
                  <div className="w-full bg-slate/20 rounded-full h-3 mb-4 overflow-hidden">
                    <div 
                      className="bg-neon h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${((quota.total - quota.used) / quota.total) * 100}%` }}
                    />
                  </div>
                  {quota.used >= quota.total && (
                    <Button className="bg-neon text-midnight hover:bg-neon/90 w-full">
                      Upgrade to Pro
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-neon" />
                  <CardTitle className="font-heading text-midnight">Recent Posts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentPosts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className={`group relative p-3 bg-slate/5 rounded-lg transition-all duration-200 hover:bg-slate/10 hover:shadow-md cursor-pointer ${
                      index === 0 ? 'animate-slide-in-item' : ''
                    }`}
                    onClick={() => handleCopy(post.preview)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Copy post: ${post.preview}`}
                  >
                    <div className="text-sm text-midnight mb-1 pr-8">{post.preview}</div>
                    <div className="text-xs text-slate">{post.date}</div>
                    <ClipboardCopy className="absolute top-3 right-3 w-4 h-4 text-slate opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-3 border-midnight hover:bg-mint hover:text-midnight">
                  View All History
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
              <CardHeader>
                <CardTitle className="font-heading text-midnight">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/settings">
                  <div className="bg-slate/5 rounded-lg p-4 transition-all duration-200 hover:bg-slate/10 hover:shadow-md cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-neon/20 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-neon" />
                      </div>
                      <div>
                        <div className="font-semibold text-midnight">Account Settings</div>
                        <div className="text-xs text-slate">Manage your preferences</div>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to="/settings">
                  <div className="bg-slate/5 rounded-lg p-4 transition-all duration-200 hover:bg-slate/10 hover:shadow-md cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-neon/20 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-neon" />
                      </div>
                      <div>
                        <div className="font-semibold text-midnight">Profile Setup</div>
                        <div className="text-xs text-slate">Complete your profile</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
