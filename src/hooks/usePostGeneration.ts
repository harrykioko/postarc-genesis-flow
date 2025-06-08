
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

      // Get session for auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Please sign in to generate posts");
      }

      // Use direct fetch instead of supabase.functions.invoke
      const response = await fetch(`https://obmrbvozmozvvxirrils.supabase.co/functions/v1/generate-post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log("📊 Direct fetch response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        
        console.log("📊 Error response:", {
          status: response.status,
          data: data,
          quotaExceeded: data.quotaExceeded,
          error: data.error
        });
        
        // Check for quota exceeded - handle multiple possible error formats
        if (response.status === 403 && 
            (data.quotaExceeded || 
             data.error?.toLowerCase().includes('quota') ||
             data.error === 'Quota exceeded')) {
          
          console.log("🎯 QUOTA EXCEEDED DETECTED!", data);
          
          // Extract quota information from the error response
          const quotaData = {
            currentUsage: data.currentUsage ?? data.used ?? currentUsage,
            limit: data.limit ?? data.totalQuota ?? data.quota ?? totalQuota,
            resetDate: data.resetDate ?? data.reset_date ?? resetDate
          };
          
          console.log("🚀 Setting quota error data:", quotaData);
          setQuotaErrorData(quotaData);
          setShowUpsellModal(true);
          return;
        }
        
        // For other errors, throw with appropriate message
        throw new Error(data.error || data.message || 'Failed to generate post');
      }

      // ALWAYS parse the response as JSON
      const data = await response.json();
      
      console.log("📊 Success response:", data);

      // Success case
      console.log("✅ Generation successful!");
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
