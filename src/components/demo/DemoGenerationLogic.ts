
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
    console.log('❌ Empty input provided');
    toast({
      title: "Input required",
      description: "Please enter a topic or paste a URL",
      variant: "destructive"
    });
    return;
  }

  console.log('🚀 Starting demo generation with input:', input.trim());
  console.log('📊 Current demo usage:', demoUsage);
  console.log('🎭 Selected template:', selectedTemplate);
  
  // Clear any previous post before starting generation
  if (clearGeneratedPost) {
    clearGeneratedPost();
  }

  setIsGenerating(true);
  
  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('⏰ Request timeout after 30 seconds');
    controller.abort();
  }, 30000); // 30 second timeout
  
  try {
    const sessionId = getDemoSessionId();
    console.log('📝 Using session ID:', sessionId);
    
    const requestBody = {
      input: input.trim(),
      template: selectedTemplate
    };
    console.log('📤 Request body:', requestBody);

    // Construct the full URL for the edge function
    const functionUrl = 'https://obmrbvozmozvvxirrils.supabase.co/functions/v1/demoGenerate';
    console.log('🔗 Making API call to:', functionUrl);

    // Remove authentication headers since this is now a public function
    const requestHeaders = {
      'Content-Type': 'application/json',
      'x-demo-session': sessionId
    };
    console.log('📋 Request headers:', requestHeaders);

    console.log('📡 Sending fetch request to public endpoint...');
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('📥 API response received');
    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    // Check for 401 specifically to catch auth issues
    if (response.status === 401) {
      console.error('🚫 Authentication error - function may still require auth');
      toast({
        title: "Configuration Error",
        description: "Demo function requires configuration update. Please try again in a moment.",
        variant: "destructive"
      });
      return;
    }

    let data;
    try {
      const responseText = await response.text();
      console.log('📄 Raw response text:', responseText);
      data = JSON.parse(responseText);
      console.log('📊 Parsed response data:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON:', parseError);
      throw new Error('Invalid response format from server');
    }

    if (data.error === 'demo_limit_exceeded') {
      console.log('🚫 Demo limit exceeded');
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
      console.error('❌ Response status:', response.status);
      toast({
        title: "Generation failed",
        description: data.message || `Server error: ${response.status}`,
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
    console.log('✅ Successfully generated post of length:', data.post.length);
    console.log('✅ Post content preview:', data.post.substring(0, 100) + '...');
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
    console.error('🚨 Generation error details:', error);
    console.error('🚨 Error name:', error.name);
    console.error('🚨 Error message:', error.message);
    console.error('🚨 Error stack:', error.stack);
    
    if (error.name === 'AbortError') {
      console.log('⏰ Request was aborted due to timeout');
      toast({
        title: "Request timeout",
        description: "The request took too long. Please try again.",
        variant: "destructive"
      });
    } else if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      console.log('🌐 Network error detected');
      toast({
        title: "Network error",
        description: "Unable to connect to the server. Please check your connection and try again.",
        variant: "destructive"
      });
    } else {
      console.log('🚨 Unknown error occurred');
      toast({
        title: "Generation failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  } finally {
    console.log('🏁 Generation process completed, setting isGenerating to false');
    setIsGenerating(false);
  }
};
