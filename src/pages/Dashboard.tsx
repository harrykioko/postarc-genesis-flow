import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PostGenerator } from "@/components/dashboard/PostGenerator";
import { GeneratedPost } from "@/components/dashboard/GeneratedPost";
import { PlanActivitySection } from "@/components/dashboard/PlanActivitySection";
import { PostHistory } from "@/components/dashboard/PostHistory";
import { ProfileSetupWizard } from "@/components/ProfileSetupWizard";
import { UpsellModal } from "@/components/UpsellModal";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuota } from "@/hooks/useQuota";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, refreshProfile } = useUserProfile();
  const { canGenerate, remainingQuota, totalQuota, plan, currentUsage, resetDate, refreshQuota } = useQuota();
  
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("consultant");
  const [useEmojis, setUseEmojis] = useState(true);
  const [useHashtags, setUseHashtags] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [showSpark, setShowSpark] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  // Real recent posts state - replace mock data
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // State for quota data from error response
  const [quotaErrorData, setQuotaErrorData] = useState<{
    currentUsage: number;
    limit: number;
    resetDate: string;
  } | null>(null);

  // Helper function to format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Fetch recent posts from database
  const fetchRecentPosts = async () => {
    try {
      setLoadingPosts(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select('id, prompt_topic, content, created_at, template_used')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      const transformedPosts = data.map(post => ({
        id: post.id,
        preview: post.content.substring(0, 60) + "...",
        date: formatRelativeTime(new Date(post.created_at)),
        fullText: post.content
      }));

      setRecentPosts(transformedPosts);
    } catch (error) {
      console.error('Failed to fetch recent posts:', error);
      toast({
        title: "Failed to load history",
        description: "Could not load your recent posts",
        variant: "destructive",
      });
    } finally {
      setLoadingPosts(false);
    }
  };

  // Fetch posts when component mounts and profile is ready
  useEffect(() => {
    if (profile && profile.profile_complete) {
      fetchRecentPosts();
    }
  }, [profile]);

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
    
    // Remove the pre-flight quota check - let the API handle quota enforcement
    
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
        
        // Check for 403 status and try to parse quota data from error
        if (error.status === 403) {
          console.log("Got 403 error, checking for quota data");
          
          // Try to parse quota data from the error message or context
          let quotaData = null;
          
          // First, check if data contains the quota info even in error case
          if (data && data.quotaExceeded) {
            quotaData = {
              currentUsage: data.currentUsage || currentUsage,
              limit: data.limit || totalQuota,
              resetDate: data.resetDate || resetDate
            };
          }
          // If not in data, try to parse from error message
          else if (error.message) {
            try {
              // Sometimes the error message contains JSON
              const parsed = JSON.parse(error.message);
              if (parsed.quotaExceeded) {
                quotaData = {
                  currentUsage: parsed.currentUsage || currentUsage,
                  limit: parsed.limit || totalQuota,
                  resetDate: parsed.resetDate || resetDate
                };
              }
            } catch (e) {
              // If parsing fails, check if message contains quota info
              if (error.message.includes("quota exceeded") || error.message.includes("monthly limit")) {
                quotaData = {
                  currentUsage: currentUsage,
                  limit: totalQuota,
                  resetDate: resetDate
                };
              }
            }
          }
          
          // Set quota data and show modal
          if (quotaData) {
            console.log("Found quota data in error:", quotaData);
            setQuotaErrorData(quotaData);
          }
          
          setShowUpsellModal(true);
          return;
        }
        
        throw error;
      }

      if (data.error) {
        console.error("API error:", data.error);
        
        // Check if it's a quota exceeded error in the data response
        if (data.quotaExceeded) {
          setQuotaErrorData({
            currentUsage: data.currentUsage || currentUsage,
            limit: data.limit || totalQuota,
            resetDate: data.resetDate || resetDate
          });
          setShowUpsellModal(true);
          return;
        }
        
        throw new Error(data.error);
      }

      console.log("Generated post data:", data);

      // Success! Update the UI
      setGeneratedPost(data.post);
      setShowPulse(true);
      
      // Refresh quota and recent posts after successful generation
      refreshQuota();
      await fetchRecentPosts();
      
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
      
      // Handle specific error cases for non-quota errors
      let errorMessage = "Failed to generate post. Please try again.";
      
      if (error.message?.includes("Invalid URL")) {
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

  const handleUpgrade = () => {
    // Navigate to pricing page and close modal
    setShowUpsellModal(false);
    setQuotaErrorData(null);
    navigate('/pricing');
  };

  const handleUpsellModalClose = () => {
    setShowUpsellModal(false);
    setQuotaErrorData(null);
  };

  // Determine which quota data to use for the modal
  const modalQuotaData = quotaErrorData || {
    currentUsage,
    limit: totalQuota,
    resetDate
  };

  return (
    <div className="min-h-screen bg-gradient-animated bg-[length:100%_200%] animate-bgMove motion-reduce:animate-none motion-reduce:bg-gradient-brand">
      <DashboardHeader quota={{ used: currentUsage, total: totalQuota }} showPulse={showPulse} />

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
              quota={{ used: currentUsage, total: totalQuota }}
              showSpark={showSpark}
              onGenerate={handleGenerate}
            />

            <GeneratedPost
              generatedPost={generatedPost}
              onCopy={handleCopy}
              onShare={handleShare}
            />

            <PostHistory
              recentPosts={recentPosts.map(post => ({
                ...post,
                template: post.fullText ? 'VC' : undefined
              }))}
              onCopy={handleCopy}
              loading={loadingPosts}
            />
          </div>

          {/* Right Sidebar - Plan Activity Section */}
          <div className="space-y-6 md:order-last order-first">
            <PlanActivitySection onUpgrade={() => setShowUpsellModal(true)} />
          </div>
        </div>
      </div>

      {/* Upsell Modal */}
      <UpsellModal
        isOpen={showUpsellModal}
        onClose={handleUpsellModalClose}
        onUpgrade={handleUpgrade}
        currentUsage={modalQuotaData.currentUsage}
        limit={modalQuotaData.limit}
        resetDate={modalQuotaData.resetDate}
      />
    </div>
  );
};

export default Dashboard;
