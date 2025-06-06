
// Fallback toast function if not available
const toast = (params: any) => {
  console.log('Toast:', params.title, params.description);
};

interface DemoUsage {
  used: number;
  limit: number;
  remaining: number;
}

export const handleDemoGeneration = async (
  input: string,
  selectedTemplate: string,
  getDemoSessionId: () => string,
  demoUsage: DemoUsage,
  setIsGenerating: (loading: boolean) => void,
  setGeneratedPost: (post: string) => void,
  updateDemoUsage: (usage: DemoUsage) => void
) => {
  if (!input.trim()) {
    toast({
      title: "Input required",
      description: "Please enter a topic or paste a URL",
      variant: "destructive"
    });
    return;
  }

  setIsGenerating(true);
  
  try {
    console.log('Making API call to demoGenerate...');
    const response = await fetch('https://obmrbvozmozvvxirrils.supabase.co/functions/v1/demoGenerate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-demo-session': getDemoSessionId()
      },
      body: JSON.stringify({
        input: input.trim(),
        template: selectedTemplate
      })
    });

    const data = await response.json();
    console.log('API response:', data);

    if (data.error === 'demo_limit_exceeded') {
      // Handle limit exceeded
      toast({
        title: "Demo limit reached! 🎉",
        description: data.message,
      });
      
      // Update local usage to reflect limit
      const newUsage = { used: 3, limit: 3, remaining: 0 };
      updateDemoUsage(newUsage);
      return;
    }

    if (data.error) {
      toast({
        title: "Generation failed",
        description: data.message || "Please try again",
        variant: "destructive"
      });
      return;
    }

    // Success!
    setGeneratedPost(data.post);
    
    // Update usage tracking - ensure we have valid demo_usage data
    let newUsage;
    if (data.demo_usage && typeof data.demo_usage.remaining === 'number') {
      newUsage = data.demo_usage;
    } else {
      // Fallback: manually calculate usage
      const currentUsage = demoUsage || { used: 0, limit: 3, remaining: 3 };
      newUsage = {
        used: currentUsage.used + 1,
        limit: 3,
        remaining: Math.max(0, currentUsage.remaining - 1)
      };
    }
    
    updateDemoUsage(newUsage);

    // Show success message
    if (newUsage.remaining > 0) {
      toast({
        title: "Post generated! ✨",
        description: `${newUsage.remaining} free ${newUsage.remaining === 1 ? 'try' : 'tries'} remaining`,
      });
    } else {
      toast({
        title: "Amazing! That was your last free try",
        description: "Sign up now for 5 more posts every month!",
      });
    }

  } catch (error) {
    console.error('Generation error:', error);
    toast({
      title: "Network error",
      description: "Please check your connection and try again",
      variant: "destructive"
    });
  } finally {
    setIsGenerating(false);
  }
};
