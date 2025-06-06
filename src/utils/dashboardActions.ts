
import { useToast } from '@/hooks/use-toast';

export const useDashboardActions = () => {
  const { toast } = useToast();

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

  const handleShare = (generatedPost: string) => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent('Check out this post I created with PostArc.ai')}&summary=${encodeURIComponent(generatedPost)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  return {
    handleCopy,
    handleShare
  };
};
