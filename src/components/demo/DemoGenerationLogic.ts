
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
  updateDemoUsage: (usage: DemoUsage) => void,
  clearGeneratedPost?: () => void
) => {
  if (!input.trim()) {
    toast({
      title: "Input required",
      description: "Please enter a topic or paste a URL",
      variant: "destructive"
    });
    return;
  }

  console.log('🚀 Starting demo generation with input:', input.trim());
  console.log('📊 Current demo usage:', demoUsage);
  
  // Clear any previous post before starting generation
  if (clearGeneratedPost) {
    clearGeneratedPost();
  }

  setIsGenerating(true);
  
  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    console.log('🔗 Making API call to demoGenerate...');
    const sessionId = getDemoSessionId();
    console.log('📝 Using session ID:', sessionId);
    
    const requestBody = {
      input: input.trim(),
      template: selectedTemplate
    };
    console.log('📤 Request body:', requestBody);

    const response = await fetch('https://obmrbvozmozvvxirrils.supabase.co/functions/v1/demoGenerate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-demo-session': sessionId
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('📥 API response status:', response.status);

    const data = await response.json();
    console.log('📊 API response data:', data);

    if (data.error === 'demo_limit_exceeded') {
      console.log('🚫 Demo limit exceeded');
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

    if (data.error || !response.ok) {
      console.error('❌ API returned error:', data);
      toast({
        title: "Generation failed",
        description: data.message || "Please try again",
        variant: "destructive"
      });
      return;
    }

    // Validate that we received a post
    if (!data.post || typeof data.post !== 'string' || data.post.trim() === '') {
      console.error('❌ Invalid post data received:', data);
      toast({
        title: "Generation failed",
        description: "Received invalid post content. Please try again.",
        variant: "destructive"
      });
      return;
    }

    // Success!
    console.log('✅ Successfully generated post:', data.post);
    setGeneratedPost(data.post);
    
    // Update usage tracking - ensure we have valid demo_usage data
    let newUsage;
    if (data.demo_usage && typeof data.demo_usage.remaining === 'number') {
      newUsage = data.demo_usage;
      console.log('📊 Using usage data from API:', newUsage);
    } else {
      // Fallback: manually calculate usage
      const currentUsage = demoUsage || { used: 0, limit: 3, remaining: 3 };
      newUsage = {
        used: currentUsage.used + 1,
        limit: 3,
        remaining: Math.max(0, currentUsage.remaining - 1)
      };
      console.log('📊 Calculated usage manually:', newUsage);
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

  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('🚨 Generation error:', error);
    
    if (error.name === 'AbortError') {
      toast({
        title: "Request timeout",
        description: "The request took too long. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Network error",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    }
  } finally {
    setIsGenerating(false);
  }
};
