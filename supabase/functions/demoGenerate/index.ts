
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-demo-session',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { input, template } = await req.json();
    const sessionId = req.headers.get('x-demo-session');

    if (!input || !sessionId) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check demo usage
    const { data: existingUsage } = await supabaseClient
      .from('demo_usage')
      .select('usage_count')
      .eq('session_id', sessionId)
      .single();

    const currentUsage = existingUsage?.usage_count || 0;
    if (currentUsage >= 3) {
      return new Response(JSON.stringify({
        error: 'demo_limit_exceeded',
        message: 'You\'ve used all 3 free demo posts! Sign up now for 5 more posts every month.',
        demo_usage: { used: 3, limit: 3, remaining: 0 }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build system prompt based on template
    let systemPrompt = '';
    switch (template) {
      case 'Consultant':
        systemPrompt = 'You are a professional consultant creating LinkedIn posts. Write in an authoritative yet approachable tone that demonstrates expertise and builds trust.';
        break;
      case 'Founder':
        systemPrompt = 'You are an entrepreneur creating LinkedIn posts. Write with passion about business, growth, and innovation. Share lessons learned and inspire others.';
        break;
      case 'Sales':
        systemPrompt = 'You are a sales professional creating LinkedIn posts. Write in an engaging and relationship-focused tone that builds connections.';
        break;
      case 'VC':
        systemPrompt = 'You are a venture capitalist creating LinkedIn posts. Write with analytical and forward-thinking perspective about investments and startups.';
        break;
      case 'HR':
        systemPrompt = 'You are an HR professional creating LinkedIn posts. Write with empathy and focus on people, culture, and workplace topics.';
        break;
      default:
        systemPrompt = 'You are a professional creating LinkedIn posts. Write in a professional yet engaging tone.';
    }

    systemPrompt += '\n\nCreate a LinkedIn post that is engaging, professional, and valuable to your network. The post should be 100-200 words.';

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
          { role: 'user', content: `Create a LinkedIn post about: ${input}` }
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

    // Update usage tracking
    await supabaseClient
      .from('demo_usage')
      .upsert({
        session_id: sessionId,
        usage_count: currentUsage + 1,
        last_used_at: new Date().toISOString(),
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      }, { onConflict: 'session_id' });

    const newUsage = {
      used: currentUsage + 1,
      limit: 3,
      remaining: Math.max(0, 3 - (currentUsage + 1))
    };

    console.log('Demo post generated for session:', sessionId, newUsage);

    return new Response(JSON.stringify({
      post: generatedPost,
      demo_usage: newUsage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Demo generation error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate post',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
