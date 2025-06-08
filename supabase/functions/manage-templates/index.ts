import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  // Log request details for debugging
  console.log(`📝 ${req.method} request received`);
  console.log('📋 Request headers:', Object.fromEntries(req.headers.entries()));
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    const authHeader = req.headers.get('Authorization');
    console.log('🔐 Auth header present:', !!authHeader);
    if (!authHeader) {
      console.error('❌ No authorization header found');
      return new Response(JSON.stringify({
        error: 'No authorization header'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      console.error('❌ Authentication error:', authError);
      return new Response(JSON.stringify({
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    console.log('✅ Authenticated user:', user.id);
    const { method } = req;
    const url = new URL(req.url);
    const templateId = url.searchParams.get('id');
    if (method === 'GET') {
      if (templateId) {
        // Get specific template
        const { data, error } = await supabase.from('custom_templates').select('*').eq('id', templateId).eq('user_id', user.id).single();
        if (error) {
          console.error('❌ Error fetching template:', error);
          return new Response(JSON.stringify({
            error: error.message
          }), {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        }
        return new Response(JSON.stringify(data), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Get all user's templates
        const { data, error } = await supabase.from('custom_templates').select('*').eq('user_id', user.id).eq('is_active', true).order('created_at', {
          ascending: false
        });
        if (error) {
          console.error('❌ Error fetching templates:', error);
          return new Response(JSON.stringify({
            error: error.message
          }), {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        }
        return new Response(JSON.stringify({
          templates: data
        }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
    }
    if (method === 'POST') {
      // Add better request body handling
      let body;
      try {
        const rawText = await req.text();
        console.log('📥 Raw request body:', rawText);
        if (!rawText || rawText.trim() === '') {
          console.error('❌ Empty request body received');
          return new Response(JSON.stringify({
            error: 'Empty request body'
          }), {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        }
        body = JSON.parse(rawText);
        console.log('📋 Parsed request body:', body);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
        return new Response(JSON.stringify({
          error: 'Invalid JSON in request body'
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      // Validate required fields
      if (!body.name || !body.foundation_type || !body.structure_type || !Array.isArray(body.tone_attributes)) {
        console.error('❌ Missing required fields:', body);
        return new Response(JSON.stringify({
          error: 'Missing required fields: name, foundation_type, tone_attributes (array), structure_type'
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      // Generate system prompt based on wizard choices
      const systemPrompt = generateSystemPrompt(body);
      console.log('✅ Generated system prompt for template');
      const { data, error } = await supabase.from('custom_templates').insert({
        user_id: user.id,
        name: body.name,
        foundation_type: body.foundation_type,
        tone_attributes: body.tone_attributes,
        structure_type: body.structure_type,
        industry_context: body.industry_context || null,
        system_prompt: systemPrompt
      }).select().single();
      if (error) {
        console.error('❌ Database error creating template:', error);
        return new Response(JSON.stringify({
          error: error.message
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      console.log('✅ Template created successfully:', data.id);
      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    if (method === 'PUT') {
      let body;
      try {
        const rawText = await req.text();
        console.log('📥 Raw PUT request body:', rawText);
        if (!rawText || rawText.trim() === '') {
          console.error('❌ Empty PUT request body received');
          return new Response(JSON.stringify({
            error: 'Empty request body'
          }), {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        }
        body = JSON.parse(rawText);
        console.log('📋 Parsed PUT request body:', body);
      } catch (parseError) {
        console.error('❌ Failed to parse PUT JSON:', parseError);
        return new Response(JSON.stringify({
          error: 'Invalid JSON in request body'
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      // Generate updated system prompt
      const systemPrompt = generateSystemPrompt(body);
      const { data, error } = await supabase.from('custom_templates').update({
        name: body.name,
        foundation_type: body.foundation_type,
        tone_attributes: body.tone_attributes,
        structure_type: body.structure_type,
        industry_context: body.industry_context || null,
        system_prompt: systemPrompt
      }).eq('id', body.id).eq('user_id', user.id).select().single();
      if (error) {
        console.error('❌ Database error updating template:', error);
        return new Response(JSON.stringify({
          error: error.message
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      console.log('✅ Template updated successfully:', data.id);
      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    if (method === 'DELETE') {
      let body;
      try {
        const rawText = await req.text();
        console.log('📥 Raw DELETE request body:', rawText);
        if (!rawText || rawText.trim() === '') {
          console.error('❌ Empty DELETE request body received');
          return new Response(JSON.stringify({
            error: 'Empty request body - template ID required'
          }), {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        }
        body = JSON.parse(rawText);
        console.log('📋 Parsed DELETE request body:', body);
      } catch (parseError) {
        console.error('❌ Failed to parse DELETE JSON:', parseError);
        return new Response(JSON.stringify({
          error: 'Invalid JSON in request body'
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      const templateId = body.id;
      if (!templateId) {
        return new Response(JSON.stringify({
          error: 'Template ID required'
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      console.log('🗑️ Deleting template:', templateId);
      const { error } = await supabase.from('custom_templates').update({
        is_active: false
      }).eq('id', templateId).eq('user_id', user.id);
      if (error) {
        console.error('❌ Database error deleting template:', error);
        return new Response(JSON.stringify({
          error: error.message
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      console.log('✅ Template deleted successfully:', templateId);
      return new Response(JSON.stringify({
        success: true
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response(JSON.stringify({
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('❌ Unexpected error in manage-templates function:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
function generateSystemPrompt(template) {
  let prompt = "You are a LinkedIn content creator specializing in professional thought leadership posts. ";
  // Foundation type
  const foundationPrompts = {
    fresh: "Create original content from scratch with a unique perspective.",
    consultant: "Write with the authoritative, analytical tone of a seasoned consultant. Focus on frameworks, methodologies, and strategic insights.",
    founder: "Write with the entrepreneurial, visionary voice of a startup founder. Share lessons learned, growth insights, and bold predictions.",
    sales: "Write with an engaging, relationship-focused approach. Emphasize value creation, customer success stories, and market insights.",
    hr: "Write with a people-first perspective. Focus on talent, culture, leadership development, and workplace trends.",
    vc: "Write with an investment-focused lens. Share market analysis, startup insights, and funding trends."
  };
  prompt += foundationPrompts[template.foundation_type] + " ";
  // Tone attributes
  if (template.tone_attributes.length > 0) {
    const toneDescriptions = {
      conversational: "conversational and approachable",
      professional: "polished and professional",
      thoughtful: "reflective and insightful",
      bold: "confident and decisive",
      friendly: "warm and personable",
      direct: "clear and straightforward",
      educational: "informative and instructional",
      innovative: "forward-thinking and creative",
      analytical: "data-driven and logical",
      playful: "lighthearted and engaging",
      energetic: "dynamic and enthusiastic",
      inspirational: "motivating and uplifting"
    };
    const tones = template.tone_attributes.map((tone)=>toneDescriptions[tone]).filter(Boolean).join(", ");
    prompt += `Write in a ${tones} tone. `;
  }
  // Structure type
  const structurePrompts = {
    story: "Use a narrative structure: Start with a compelling hook or personal anecdote, develop the story with context and challenges, then conclude with insights and lessons learned.",
    insight_list: "Structure as an insight list: Begin with an engaging introduction, present 3-5 key points or insights with clear explanations, and end with a concise conclusion or call to action.",
    problem_solution: "Follow a problem-solution format: Identify and describe a specific challenge or issue, analyze why it matters, then present your solution or approach with practical steps.",
    case_study: "Write as a case study: Present a specific challenge or project, describe the process and methodology used, and highlight measurable results and key takeaways.",
    opinion: "Structure as an opinion piece: Present your viewpoint clearly, support it with evidence, examples, or experience, and invite thoughtful discussion or debate."
  };
  prompt += structurePrompts[template.structure_type] + " ";
  // Industry context
  if (template.industry_context) {
    prompt += `Focus on insights relevant to the ${template.industry_context} industry. Include specific terminology, metrics, trends, and challenges common in this field. `;
  }
  prompt += "Keep posts engaging and professional, optimized for LinkedIn's algorithm and audience engagement. Aim for 1-3 paragraphs unless the content naturally requires more length.";
  return prompt;
}
