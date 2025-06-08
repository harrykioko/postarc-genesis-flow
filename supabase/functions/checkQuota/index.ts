
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

    // Use the database function to check quota
    const { data: quotaResult, error: quotaError } = await supabaseClient
      .rpc('check_user_quota', { user_uuid: user.id });

    if (quotaError) {
      console.error('Quota check error:', quotaError);
      // Return safe defaults on error
      return new Response(JSON.stringify({
        canGenerate: false,
        remainingQuota: 0,
        totalQuota: 5,
        plan: 'free',
        resetDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        currentUsage: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const quota = quotaResult;
    const canGenerate = quota.remaining > 0 || quota.remaining === -1; // -1 means unlimited
    const resetDate = new Date(quota.reset_date).toISOString();

    console.log('Quota check for user:', user.id, {
      used: quota.used,
      remaining: quota.remaining,
      quota: quota.quota,
      canGenerate
    });

    return new Response(JSON.stringify({
      canGenerate,
      remainingQuota: quota.remaining,
      totalQuota: quota.quota,
      plan: quota.tier || 'free',
      resetDate,
      currentUsage: quota.used
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Quota check error:', error);
    
    // Return safe defaults on error
    return new Response(JSON.stringify({
      canGenerate: false,
      remainingQuota: 0,
      totalQuota: 5,
      plan: 'free',
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      currentUsage: 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
