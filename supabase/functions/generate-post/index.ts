
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check quota first
    const { data: quotaData, error: quotaError } = await supabaseClient.functions.invoke('checkQuota');
    
    if (quotaError || !quotaData.canGenerate) {
      console.log('Quota exceeded for user:', user.id, quotaData);
      return new Response(JSON.stringify({
        error: 'Quota exceeded',
        quotaExceeded: true,
        currentUsage: quotaData?.currentUsage || 0,
        limit: quotaData?.totalQuota || 5,
        resetDate: quotaData?.resetDate
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { topic, url, template, hasEmojis = false, hasHashtags = false } = await req.json();

    // Get user profile for context
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('name, job_title, linkedin_head, brand_voice')
      .eq('id', user.id)
      .single();

    let content = '';
    let scrapedData = null;

    if (url) {
      // Scrape URL content
      try {
        const scrapeResponse = await fetch(url);
        const htmlContent = await scrapeResponse.text();
        
        // Basic content extraction (title and meta description)
        const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descMatch = htmlContent.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        
        content = [
          titleMatch?.[1] || '',
          descMatch?.[1] || ''
        ].filter(Boolean).join('\n\n');

        scrapedData = {
          title: titleMatch?.[1] || '',
          description: descMatch?.[1] || '',
          url: url
        };
        
        if (!content) {
          throw new Error('Could not extract content from URL');
        }
      } catch (error) {
        console.error('URL scraping failed:', error);
        return new Response(JSON.stringify({
          error: 'Could not fetch content from URL',
          message: 'Please check the URL and try again, or enter a topic instead.'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      content = topic;
    }

    // Build prompt based on template and user profile
    let systemPrompt = '';
    
    switch (template) {
      case 'Consultant':
        systemPrompt = `You are a professional consultant creating LinkedIn posts. Write in an authoritative yet approachable tone that demonstrates expertise and builds trust.`;
        break;
      case 'Thought Leader':
        systemPrompt = `You are an industry thought leader creating LinkedIn posts. Share insights, trends, and forward-thinking perspectives that position you as an innovator.`;
        break;
      case 'Entrepreneur':
        systemPrompt = `You are an entrepreneur creating LinkedIn posts. Write with passion about business, growth, and innovation. Share lessons learned and inspire others.`;
        break;
      case 'Executive':
        systemPrompt = `You are a C-level executive creating LinkedIn posts. Write with strategic vision and leadership perspective. Focus on high-level insights and industry direction.`;
        break;
      default:
        systemPrompt = `You are a professional creating LinkedIn posts. Write in a professional yet engaging tone.`;
    }

    if (userProfile) {
      systemPrompt += ` Your profile: ${userProfile.name || 'Professional'}, ${userProfile.job_title || 'Professional'}. ${userProfile.brand_voice ? `Brand voice: ${userProfile.brand_voice}` : ''}`;
    }

    systemPrompt += `\n\nCreate a LinkedIn post that is engaging, professional, and valuable to your network. The post should be 100-200 words.`;
    
    if (hasEmojis) {
      systemPrompt += ` Include relevant emojis to make the post more engaging.`;
    }
    
    if (hasHashtags) {
      systemPrompt += ` Include 3-5 relevant hashtags at the end.`;
    }

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a LinkedIn post about: ${content}` }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error('Failed to generate post with AI');
    }

    const aiData = await openAIResponse.json();
    const generatedPost = aiData.choices[0].message.content;

    // Save the post to database
    const { data: savedPost, error: saveError } = await supabaseClient
      .from('posts')
      .insert({
        user_id: user.id,
        content: generatedPost,
        template_used: template,
        prompt_topic: topic,
        scraped_data: scrapedData,
        emojis_enabled: hasEmojis,
        hashtags_enabled: hasHashtags
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving post:', saveError);
    }

    // Log usage event
    await supabaseClient
      .from('usage_events')
      .insert({
        user_id: user.id,
        event_type: 'generation'
      });

    console.log('Post generated successfully for user:', user.id);

    return new Response(JSON.stringify({
      post: generatedPost,
      post_id: savedPost?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Post generation error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate post',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
