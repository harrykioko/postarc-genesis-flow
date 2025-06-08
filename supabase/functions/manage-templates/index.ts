import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface CreateTemplateRequest {
  name: string;
  foundation_type: string;
  tone_attributes: string[];
  structure_type: string;
  industry_context?: string;
}

interface UpdateTemplateRequest extends CreateTemplateRequest {
  id: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Verify user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Authenticated user:', user.id)

    // Check if user is Pro or Legend
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Only Pro and Legend users can create custom templates
    if (userData.role !== 'pro' && userData.role !== 'legend') {
      return new Response(
        JSON.stringify({ error: 'Custom templates require Pro or Legend plan' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { method } = req
    const url = new URL(req.url)

    switch (method) {
      case 'GET': {
        // Get all user's active templates
        const { data, error } = await supabaseAdmin
          .from('custom_templates')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ templates: data || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'POST': {
        const body = await req.json() as CreateTemplateRequest
        
        // Validate required fields
        if (!body.name?.trim() || !body.foundation_type || !body.structure_type || !Array.isArray(body.tone_attributes) || body.tone_attributes.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check template limit (10 templates per user)
        const { count } = await supabaseAdmin
          .from('custom_templates')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_active', true)

        if (count && count >= 10) {
          return new Response(
            JSON.stringify({ error: 'Template limit reached (10 max)' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Generate system prompt
        const systemPrompt = generateSystemPrompt(body)

        // Create template
        const { data, error } = await supabaseAdmin
          .from('custom_templates')
          .insert({
            user_id: user.id,
            name: body.name.trim(),
            foundation_type: body.foundation_type,
            tone_attributes: body.tone_attributes,
            structure_type: body.structure_type,
            industry_context: body.industry_context?.trim() || null,
            system_prompt: systemPrompt,
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PUT': {
        const body = await req.json() as UpdateTemplateRequest
        
        if (!body.id) {
          return new Response(
            JSON.stringify({ error: 'Template ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Generate updated system prompt
        const systemPrompt = generateSystemPrompt(body)

        // Update template
        const { data, error } = await supabaseAdmin
          .from('custom_templates')
          .update({
            name: body.name.trim(),
            foundation_type: body.foundation_type,
            tone_attributes: body.tone_attributes,
            structure_type: body.structure_type,
            industry_context: body.industry_context?.trim() || null,
            system_prompt: systemPrompt,
            updated_at: new Date().toISOString()
          })
          .eq('id', body.id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'DELETE': {
        const { id } = await req.json()
        
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'Template ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Soft delete
        const { error } = await supabaseAdmin
          .from('custom_templates')
          .update({ 
            is_active: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('user_id', user.id)

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error: any) {
    console.error('❌ Template management error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateSystemPrompt(template: CreateTemplateRequest): string {
  let prompt = "You are a LinkedIn content creator specializing in professional thought leadership posts. "

  // Foundation type
  const foundationPrompts: Record<string, string> = {
    fresh: "Create original content from scratch with a unique perspective.",
    consultant: "Write with the authoritative, analytical tone of a seasoned consultant. Focus on frameworks, methodologies, and strategic insights.",
    founder: "Write with the entrepreneurial, visionary voice of a startup founder. Share lessons learned, growth insights, and bold predictions.",
    sales: "Write with an engaging, relationship-focused approach. Emphasize value creation, customer success stories, and market insights.",
    hr: "Write with a people-first perspective. Focus on talent, culture, leadership development, and workplace trends.",
    vc: "Write with an investment-focused lens. Share market analysis, startup insights, and funding trends."
  }

  prompt += (foundationPrompts[template.foundation_type] || foundationPrompts.fresh) + " "

  // Tone attributes
  if (template.tone_attributes.length > 0) {
    const toneDescriptions: Record<string, string> = {
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
    }

    const tones = template.tone_attributes
      .map(tone => toneDescriptions[tone])
      .filter(Boolean)
      .join(", ")

    prompt += `Write in a ${tones} tone. `
  }

  // Structure type
  const structurePrompts: Record<string, string> = {
    story: "Use a narrative structure: Start with a compelling hook or personal anecdote, develop the story with context and challenges, then conclude with insights and lessons learned.",
    insight_list: "Structure as an insight list: Begin with an engaging introduction, present 3-5 key points or insights with clear explanations, and end with a concise conclusion or call to action.",
    problem_solution: "Follow a problem-solution format: Identify and describe a specific challenge or issue, analyze why it matters, then present your solution or approach with practical steps.",
    case_study: "Write as a case study: Present a specific challenge or project, describe the process and methodology used, and highlight measurable results and key takeaways.",
    opinion: "Structure as an opinion piece: Present your viewpoint clearly, support it with evidence, examples, or experience, and invite thoughtful discussion or debate."
  }

  prompt += (structurePrompts[template.structure_type] || structurePrompts.story) + " "

  // Industry context
  if (template.industry_context) {
    prompt += `Focus on insights relevant to the ${template.industry_context} industry. Include specific terminology, metrics, trends, and challenges common in this field. `
  }

  prompt += "Keep posts engaging and professional, optimized for LinkedIn's algorithm and audience engagement. Aim for 1-3 paragraphs unless the content naturally requires more length."

  return prompt
}