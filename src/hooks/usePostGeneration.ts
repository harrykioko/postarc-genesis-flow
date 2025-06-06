
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { templateMapping } from '@/utils/postUtils';

interface GenerationOptions {
  selectedTemplate: string;
  useEmojis: boolean;
  useHashtags: boolean;
}

interface QuotaErrorData {
  currentUsage: number;
  limit: number;
  resetDate: string;
}

export const usePostGeneration = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [showSpark, setShowSpark] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [quotaErrorData, setQuotaErrorData] = useState<QuotaErrorData | null>(null);
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  const generatePost = async (
    input: string,
    options: GenerationOptions,
    currentUsage: number,
    totalQuota: number,
    resetDate: string,
    onSuccess?: () => void
  ) => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setShowSpark(true);
    
    try {
      const isUrl = input.trim().startsWith('http://') || input.trim().startsWith('https://');
      
      const payload = {
        topic: isUrl ? undefined : input.trim(),
        url: isUrl ? input.trim() : undefined,
        template: templateMapping[options.selectedTemplate] || "Consultant",
        hasEmojis: options.useEmojis,
        hasHashtags: options.useHashtags
      };

      console.log("Calling generate-post with payload:", payload);

      const { data, error } = await supabase.functions.invoke('generate-post', {
        body: payload
      });

      if (error) {
        console.error("Supabase function error:", error);
        console.log("Full error object:", JSON.stringify(error, null, 2));
        
        const isQuotaError = (
          error.context?.res?.status === 403 ||
          error.message?.includes("quota exceeded") ||
          error.message?.includes("monthly limit") ||
          (data && data.quotaExceeded)
        );
        
        if (isQuotaError) {
          console.log("Detected quota exceeded error, checking for quota data");
          
          let quotaData = null;
          
          if (data && data.quotaExceeded) {
            quotaData = {
              currentUsage: data.currentUsage || currentUsage,
              limit: data.limit || totalQuota,
              resetDate: data.resetDate || resetDate
            };
          } else if (error.context?.res?.body) {
            try {
              const errorBody = typeof error.context.res.body === 'string' 
                ? JSON.parse(error.context.res.body) 
                : error.context.res.body;
              
              if (errorBody.quotaExceeded) {
                quotaData = {
                  currentUsage: errorBody.currentUsage || currentUsage,
                  limit: errorBody.limit || totalQuota,
                  resetDate: errorBody.resetDate || resetDate
                };
              }
            } catch (e) {
              console.log("Failed to parse error body:", e);
            }
          } else {
            quotaData = {
              currentUsage: currentUsage,
              limit: totalQuota,
              resetDate: resetDate
            };
          }
          
          console.log("Using quota data for modal:", quotaData);
          setQuotaErrorData(quotaData);
          setShowUpsellModal(true);
          return;
        }
        
        throw error;
      }

      if (data.error) {
        console.error("API error:", data.error);
        
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

      setGeneratedPost(data.post);
      setShowPulse(true);
      
      if (onSuccess) {
        onSuccess();
      }
      
      toast({
        title: "Post Generated! 🎉",
        description: "Your LinkedIn post is ready to share",
      });
      
      setTimeout(() => setShowPulse(false), 1000);

    } catch (error: any) {
      console.error("Generation failed:", error);
      
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

  return {
    isGenerating,
    generatedPost,
    showSpark,
    showPulse,
    quotaErrorData,
    showUpsellModal,
    setShowUpsellModal,
    setQuotaErrorData,
    generatePost
  };
};
