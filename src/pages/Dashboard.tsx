import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Copy, Linkedin, Sparkles, History, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("consultant");
  const [useEmojis, setUseEmojis] = useState(true);
  const [useHashtags, setUseHashtags] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [quota] = useState({ used: 2, total: 5 });

  const templates = [
    { id: "consultant", name: "Consultant", description: "Professional and authoritative tone", color: "bg-blue-500" },
    { id: "founder", name: "Founder", description: "Entrepreneurial and visionary", color: "bg-purple-500" },
    { id: "vc", name: "VC", description: "Investment-focused insights", color: "bg-green-500" },
    { id: "sales", name: "Sales", description: "Engaging and relationship-focused", color: "bg-orange-500" },
    { id: "hr", name: "HR", description: "People and culture focused", color: "bg-pink-500" },
  ];

  const recentPosts = [
    { id: 1, preview: "The future of remote work is here. After 3 years of...", date: "2 hours ago" },
    { id: 2, preview: "5 lessons I learned from failing fast in startups...", date: "1 day ago" },
    { id: 3, preview: "Why authentic leadership matters more than ever...", date: "3 days ago" },
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
    <div className="min-h-screen bg-gradient-brand">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-midnight to-neon rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-heading font-bold text-midnight">PostArc</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-neon text-midnight">
              {quota.used}/{quota.total} posts used
            </Badge>
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
            <Card className="glass-card border-0">
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
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-base font-semibold mb-3 block">Choose your style</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          selectedTemplate === template.id
                            ? 'border-neon bg-gradient-to-br from-neon/10 to-neon/5 shadow-[0_0_20px_rgba(0,255,194,0.3)]'
                            : 'border-gray-200 hover:border-neon/50 hover:shadow-md'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${template.color} mb-2`} />
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
                      />
                      <Label htmlFor="emojis">Include emojis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hashtags"
                        checked={useHashtags}
                        onCheckedChange={setUseHashtags}
                      />
                      <Label htmlFor="hashtags">Include hashtags</Label>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleGenerate}
                    disabled={!input.trim() || isGenerating || quota.used >= quota.total}
                    className="btn-neon px-6"
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
                </div>
              </CardContent>
            </Card>

            {/* Generated Post */}
            {generatedPost && (
              <Card className="glass-card-strong border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-midnight">Generated Post</CardTitle>
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
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line">
                    {generatedPost}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quota Status */}
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-midnight mb-2">
                    {quota.total - quota.used} / {quota.total}
                  </div>
                  <div className="text-slate mb-4 font-medium">{quota.used} / {quota.total} posts used this month</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                    <div 
                      className="bg-neon h-3 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${((quota.total - quota.used) / quota.total) * 100}%` }}
                    />
                  </div>
                  {quota.used >= quota.total && (
                    <Button className="btn-neon w-full">
                      Upgrade to Pro
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className="glass-card border-0">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-neon" />
                  <CardTitle className="font-heading text-midnight">Recent Posts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="p-3 bg-white/50 rounded-lg transition-all duration-200 hover:bg-white/70 hover:shadow-md cursor-pointer"
                  >
                    <div className="text-sm text-midnight mb-1">{post.preview}</div>
                    <div className="text-xs text-slate">{post.date}</div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-3">
                  View All History
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-heading text-midnight">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/settings">
                  <div className="bg-white/50 rounded-lg p-4 transition-all duration-200 hover:bg-white/70 hover:shadow-md cursor-pointer">
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
                  <div className="bg-white/50 rounded-lg p-4 transition-all duration-200 hover:bg-white/70 hover:shadow-md cursor-pointer">
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
