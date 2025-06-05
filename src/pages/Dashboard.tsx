
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PostGenerator } from "@/components/dashboard/PostGenerator";
import { GeneratedPost } from "@/components/dashboard/GeneratedPost";
import { QuotaCard } from "@/components/dashboard/QuotaCard";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { QuickActions } from "@/components/dashboard/QuickActions";

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
      <DashboardHeader quota={quota} showPulse={showPulse} />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <PostGenerator
              input={input}
              setInput={setInput}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              useEmojis={useEmojis}
              setUseEmojis={setUseEmojis}
              useHashtags={useHashtags}
              setUseHashtags={setUseHashtags}
              isGenerating={isGenerating}
              quota={quota}
              showSpark={showSpark}
              onGenerate={handleGenerate}
            />

            <GeneratedPost
              generatedPost={generatedPost}
              onCopy={handleCopy}
              onShare={handleShare}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:order-last order-first">
            <QuotaCard quota={quota} />
            <RecentPosts recentPosts={recentPosts} onCopy={handleCopy} />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
