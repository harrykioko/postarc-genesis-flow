
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PostGenerator } from "@/components/dashboard/PostGenerator";
import { GeneratedPostModal } from "@/components/dashboard/GeneratedPostModal";
import { PlanActivitySection } from "@/components/dashboard/PlanActivitySection";
import { PostHistory } from "@/components/dashboard/PostHistory";
import { ProfileSetupWizard } from "@/components/ProfileSetupWizard";
import { PricingModal } from "@/components/PricingModal";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuota } from "@/hooks/useQuota";
import { useDashboardState } from "@/hooks/useDashboardState";
import { usePostGeneration } from "@/hooks/usePostGeneration";
import { useRecentPosts } from "@/hooks/useRecentPosts";
import { useDashboardActions } from "@/utils/dashboardActions";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile, loading: profileLoading, refreshProfile } = useUserProfile();
  const { canGenerate, remainingQuota, totalQuota, plan, currentUsage, resetDate, refreshQuota } = useQuota();
  
  const {
    input,
    setInput,
    selectedTemplate,
    setSelectedTemplate,
    useEmojis,
    setUseEmojis,
    useHashtags,
    setUseHashtags,
    postToLinkedIn,
    setPostToLinkedIn,
    clearInput
  } = useDashboardState();

  const {
    isGenerating,
    generatedPost,
    showSpark,
    showPulse,
    quotaErrorData,
    showUpsellModal,
    showPostModal,
    setShowUpsellModal,
    setQuotaErrorData,
    setShowPostModal,
    generatePost
  } = usePostGeneration();

  const { 
    recentPosts, 
    allPosts, 
    loading: loadingPosts, 
    loadingAll: loadingAllPosts,
    refreshPosts,
    fetchAllPosts
  } = useRecentPosts(
    profile?.profile_complete || false
  );

  const { handleCopy, handleShare } = useDashboardActions();

  // Check for upgrade parameter and open pricing modal
  useEffect(() => {
    const shouldUpgrade = searchParams.get('upgrade');
    if (shouldUpgrade === 'true' && profile?.profile_complete) {
      setShowUpsellModal(true);
      // Clean up the URL parameter
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('upgrade');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, profile?.profile_complete, setShowUpsellModal]);

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

  const handleGenerate = async () => {
    await generatePost(
      input,
      { selectedTemplate, useEmojis, useHashtags, postToLinkedIn },
      currentUsage,
      totalQuota,
      resetDate,
      () => {
        refreshQuota();
        refreshPosts();
        clearInput();
      }
    );
  };

  const handlePricingModalClose = () => {
    setShowUpsellModal(false);
    setQuotaErrorData(null);
  };

  const handlePostModalClose = () => {
    setShowPostModal(false);
  };

  // Determine which quota data to use for the modal
  const modalQuotaData = quotaErrorData || {
    currentUsage,
    limit: totalQuota,
    resetDate
  };

  return (
    <div className="min-h-screen bg-gradient-animated bg-[length:100%_200%] animate-bgMove motion-reduce:animate-none motion-reduce:bg-gradient-brand">
      <DashboardHeader />

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
              postToLinkedIn={postToLinkedIn}
              setPostToLinkedIn={setPostToLinkedIn}
              isGenerating={isGenerating}
              quota={{ used: currentUsage, total: totalQuota }}
              showSpark={showSpark}
              onGenerate={handleGenerate}
            />
          </div>

          {/* Right Sidebar - Plan Activity Section */}
          <div className="space-y-6 md:order-last order-first">
            <PlanActivitySection onUpgrade={() => setShowUpsellModal(true)} />
          </div>
        </div>

        {/* Full-width Your Posts Section */}
        <div className="mt-8">
          <PostHistory
            recentPosts={recentPosts}
            allPosts={allPosts}
            onCopy={handleCopy}
            loading={loadingPosts}
            loadingAll={loadingAllPosts}
            onFetchAllPosts={fetchAllPosts}
          />
        </div>
      </div>

      {/* Generated Post Modal */}
      <GeneratedPostModal
        isOpen={showPostModal}
        onClose={handlePostModalClose}
        originalContent={generatedPost}
        onCopy={handleCopy}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showUpsellModal}
        onClose={handlePricingModalClose}
        currentUsage={modalQuotaData.currentUsage}
        limit={modalQuotaData.limit}
        resetDate={modalQuotaData.resetDate}
      />
    </div>
  );
};

export default Dashboard;
