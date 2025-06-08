
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { templateMapping } from '@/utils/postUtils';

interface GenerationOptions {
  selectedTemplate: string;
  useEmojis: boolean;
  useHashtags: boolean;
  postToLinkedIn: boolean;
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
  const [showPostModal, setShowPostModal] = useState(false);

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

      console.log("🚀 Calling generate-post with payload:", payload);

      // Use supabase.functions.invoke instead of direct fetch
      const { data, error } = await supabase.functions.invoke('generate-post', {
        body: payload
      });

      console.log("📊 Supabase function response:", { data, error });

      if (error) {
        console.log("📊 Error response:", {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Check for quota exceeded - the error might be in different formats
        if (error.message?.toLowerCase().includes('quota') || 
            error.details?.quotaExceeded ||
            error.message === 'Quota exceeded') {
          
          console.log("🎯 QUOTA EXCEEDED DETECTED!", error);
          
          // Extract quota information from the error details
          const quotaData = {
            currentUsage: error.details?.currentUsage ?? currentUsage,
            limit: error.details?.limit ?? totalQuota,
            resetDate: error.details?.resetDate ?? resetDate
          };
          
          console.log("🚀 Setting quota error data:", quotaData);
          setQuotaErrorData(quotaData);
          setShowUpsellModal(true);
          return;
        }
        
        // For other errors, throw with appropriate message
        throw new Error(error.message || 'Failed to generate post');
      }

      // Success case
      console.log("✅ Generation successful!", data);
      setGeneratedPost(data.post || data.content);
      setShowPulse(true);
      setShowPostModal(true);
      
      if (onSuccess) {
        onSuccess();
      }
      
      toast({
        title: "Post Generated! 🎉",
        description: "Your LinkedIn post is ready to share",
      });
      
      setTimeout(() => setShowPulse(false), 1000);

    } catch (error: any) {
      console.error("🚨 Generation error:", error);
      
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
    showPostModal,
    setShowUpsellModal,
    setQuotaErrorData,
    setShowPostModal,
    generatePost
  };
};
