
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced URL content scraper
const scrapeURL = async (url: string) => {
  console.log('Scraping URL:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const htmlContent = await response.text();
    
    // Extract title
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch?.[1]?.trim() || '';

    // Extract meta description
    const descMatch = htmlContent.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch?.[1]?.trim() || '';

    // Extract Open Graph title and description as fallbacks
    const ogTitleMatch = htmlContent.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const ogDescMatch = htmlContent.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);

    // Extract main content from common article selectors
    const contentSelectors = [
      /<article[^>]*>(.*?)<\/article>/gis,
      /<main[^>]*>(.*?)<\/main>/gis,
      /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>(.*?)<\/div>/gis,
      /<div[^>]*class=["'][^"']*post[^"']*["'][^>]*>(.*?)<\/div>/gis
    ];

    let mainContent = '';
    for (const selector of contentSelectors) {
      const matches = htmlContent.match(selector);
      if (matches && matches[0]) {
        mainContent = matches[0];
        break;
      }
    }

    // Clean HTML tags and extract text
    const cleanText = (html: string) => {
      return html
        .replace(/<script[^>]*>.*?<\/script>/gis, '')
        .replace(/<style[^>]*>.*?<\/style>/gis, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const cleanMainContent = mainContent ? cleanText(mainContent) : '';

    // Combine all extracted content
    const finalTitle = title || ogTitleMatch?.[1]?.trim() || '';
    const finalDescription = description || ogDescMatch?.[1]?.trim() || '';
    
    let combinedContent = [finalTitle, finalDescription].filter(Boolean).join('\n\n');
    
    // If we have main content and it's substantial, add it
    if (cleanMainContent && cleanMainContent.length > 100) {
      // Limit content to prevent excessive token usage
      const limitedContent = cleanMainContent.substring(0, 2000);
      combinedContent += '\n\n' + limitedContent;
    }

    if (!combinedContent.trim()) {
      throw new Error('Could not extract meaningful content from URL');
    }

    console.log('Successfully scraped content:', {
      title: finalTitle,
      description: finalDescription,
      contentLength: cleanMainContent.length,
      url
    });

    return {
      content: combinedContent,
      scrapedData: {
        title: finalTitle,
        description: finalDescription,
        url: url,
        contentLength: cleanMainContent.length
      }
    };

  } catch (error) {
    console.error('URL scraping failed:', error);
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Generate post function called');
    console.log('📋 Headers:', {
      authorization: req.headers.get('Authorization') ? 'Present' : 'Missing',
      contentType: req.headers.get('Content-Type'),
    });

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ No authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client - use service role key for server-side operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Verify the user token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('❌ Auth verification failed:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Authenticated user:', user.id, user.email);

    // Check quota using RPC
    const { data: quotaResult, error: quotaError } = await supabaseAdmin
      .rpc('check_user_quota', { user_uuid: user.id });

    console.log('📊 Quota check result:', quotaResult);

    if (quotaError) {
      console.error('❌ Quota check error:', quotaError);
      return new Response(JSON.stringify({
        error: 'Failed to check quota',
        message: quotaError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Type the quota result
    const quota = quotaResult as {
      tier: string;
      used: number;
      quota: number;
      remaining: number;
      reset_date: string;
    };

    // Check if user can generate
    const canGenerate = quota.remaining > 0 || quota.remaining === -1;

    if (!canGenerate) {
      console.log('🚫 Quota exceeded for user:', user.id, quota);
      return new Response(JSON.stringify({
        error: 'Quota exceeded',
        quotaExceeded: true,
        currentUsage: quota.used,
        limit: quota.quota,
        resetDate: quota.reset_date,
        message: `You've used all ${quota.quota} posts for this month. Upgrade to Pro for more!`
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Continue with the rest of the function...
    const { topic, url, template, hasEmojis = false, hasHashtags = false } = await req.json();

    console.log('📝 Generation request:', { topic, url, template, hasEmojis, hasHashtags });

    // Get user profile for context
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('name, job_title, linkedin_head, brand_voice')
      .eq('id', user.id)
      .single();

    let content = '';
    let scrapedData = null;

    if (url) {
      // Use enhanced URL scraping
      try {
        const scrapeResult = await scrapeURL(url);
        content = scrapeResult.content;
        scrapedData = scrapeResult.scrapedData;
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
    const { data: savedPost, error: saveError } = await supabaseAdmin
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
    await supabaseAdmin
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
