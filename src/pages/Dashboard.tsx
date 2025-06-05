import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PostGenerator } from "@/components/dashboard/PostGenerator";
import { GeneratedPost } from "@/components/dashboard/GeneratedPost";
import { QuotaCard } from "@/components/dashboard/QuotaCard";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ProfileSetupWizard } from "@/components/ProfileSetupWizard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client"; // ← Add this import

const Dashboard = () => {
  const { toast } = useToast();
  const { profile, loading: profileLoading, refreshProfile } = useUserProfile();
  
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

  // Show loading while checking profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-brand flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neon/30 border-t-neon rounded-full animate-spin mx-auto mb-4" />
          <p className="text-midnight">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show profile setup wizard if profile is incomplete
  if (profile && !profile.profile_complete) {
    return <ProfileSetupWizard onComplete={refreshProfile} />;
  }

  // Template mapping: frontend IDs to backend IDs
  const templateMapping: { [key: string]: string } = {
    "consultant": "Consultant",
    "founder": "Founder", 
    "vc": "VC",
    "sales": "Sales",
    "hr": "HR"
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setShowSpark(true);
    
    try {
      // Determine if input is a URL or topic
      const isUrl = input.trim().startsWith('http://') || input.trim().startsWith('https://');
      
      // Prepare payload for the Edge Function
      const payload = {
        topic: isUrl ? undefined : input.trim(),
        url: isUrl ? input.trim() : undefined,
        template: templateMapping[selectedTemplate] || "Consultant",
        hasEmojis: useEmojis,
        hasHashtags: useHashtags
      };

      console.log("Calling generate-post with payload:", payload);

      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('generate-post', {
        body: payload
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (data.error) {
        console.error("API error:", data.error);
        throw new Error(data.error);
      }

      console.log("Generated post data:", data);

      // Success! Update the UI
      setGeneratedPost(data.post);
      setQuota(prev => ({ ...prev, used: prev.used + 1 }));
      setShowPulse(true);
      
      // Add new post to recent list
      const newPost = {
        id: Date.now(),
        preview: data.post.substring(0, 50) + "...",
        date: "Just now"
      };
      setRecentPosts(prev => [newPost, ...prev.slice(0, 2)]);
      
      // Clear input after successful generation
      setInput("");
      
      // Show success toast
      toast({
        title: "Post Generated! 🎉",
        description: "Your LinkedIn post is ready to share",
      });
      
      setTimeout(() => setShowPulse(false), 1000);

    } catch (error: any) {
      console.error("Generation failed:", error);
      
      // Handle specific error cases
      let errorMessage = "Failed to generate post. Please try again.";
      
      if (error.message?.includes("quota exceeded")) {
        errorMessage = "You've reached your monthly limit. Upgrade to Pro for unlimited posts!";
      } else if (error.message?.includes("Invalid URL")) {
        errorMessage = "Please check your URL and try again.";
      } else if (error.message?.includes("Could not fetch")) {
        errorMessage = "Couldn't access that webpage. Try a different URL or enter a topic instead.";
      }
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setShowSpark(false), 800);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied! 📋",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        title: "Copy Failed",
        description: "Please select and copy the text manually",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent('Check out this post I created with PostArc.ai')}&summary=${encodeURIComponent(generatedPost)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
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