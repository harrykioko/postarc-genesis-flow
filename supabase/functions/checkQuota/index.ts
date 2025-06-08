
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
    console.log('🔍 CheckQuota function called');
    console.log('📋 Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Create Supabase client with the same pattern as generate-post
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    console.log('🔐 Auth header present:', !!req.headers.get('Authorization'));

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    console.log('👤 Auth result:', { 
      user: user ? `${user.id} (${user.email})` : null, 
      error: authError 
    });
    
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Authenticated user:', user.id);

    // Use the database function to check quota
    console.log('🔄 Calling check_user_quota RPC...');
    const { data: quotaResult, error: quotaError } = await supabaseClient
      .rpc('check_user_quota', { user_uuid: user.id });

    console.log('📊 Quota RPC result:', { data: quotaResult, error: quotaError });

    if (quotaError) {
      console.error('❌ Quota check error:', quotaError);
      // Return safe defaults on error
      return new Response(JSON.stringify({
        canGenerate: false,
        remainingQuota: 0,
        totalQuota: 5,
        plan: 'free',
        resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
        currentUsage: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Format the response
    const canGenerate = quotaResult.remaining > 0 || quotaResult.remaining === -1;
    const resetDate = new Date(quotaResult.reset_date).toISOString();

    const responseData = {
      canGenerate,
      remainingQuota: quotaResult.remaining === -1 ? 999 : quotaResult.remaining,
      totalQuota: quotaResult.quota === -1 ? 999 : quotaResult.quota,
      plan: quotaResult.tier || 'free',
      resetDate,
      currentUsage: quotaResult.used
    };

    console.log('✅ Quota check successful:', responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('💥 Quota check error:', error);
    
    // Return safe defaults on error
    return new Response(JSON.stringify({
      canGenerate: false,
      remainingQuota: 0,
      totalQuota: 5,
      plan: 'free',
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
      currentUsage: 0,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
