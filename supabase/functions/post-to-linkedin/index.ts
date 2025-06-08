
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

    const { post_id, content } = await req.json();

    if (!post_id || !content) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: post_id and content' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's LinkedIn token
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('linkedin_access_token, linkedin_token_expires_at, linkedin_member_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData.linkedin_access_token) {
      return new Response(JSON.stringify({ 
        error: 'LinkedIn not connected' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if token is expired
    if (userData.linkedin_token_expires_at && 
        new Date(userData.linkedin_token_expires_at) < new Date()) {
      return new Response(JSON.stringify({ 
        error: 'LinkedIn token expired. Please reconnect your account.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Post to LinkedIn using their API
    const linkedInResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userData.linkedin_access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: `urn:li:person:${userData.linkedin_member_id}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      }),
    });

    if (!linkedInResponse.ok) {
      const errorData = await linkedInResponse.json();
      console.error('LinkedIn posting failed:', errorData);
      
      let errorMessage = 'Failed to post to LinkedIn';
      if (errorData.message?.includes('token')) {
        errorMessage = 'LinkedIn token expired. Please reconnect your account.';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: errorData
      }), {
        status: linkedInResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const linkedInData = await linkedInResponse.json();
    const linkedInPostId = linkedInData.id;
    
    // Generate LinkedIn post URL (approximate format)
    const linkedInPostUrl = `https://www.linkedin.com/feed/update/${linkedInPostId}`;

    // Update the post record with LinkedIn info
    await supabaseClient
      .from('posts')
      .update({
        posted_to_linkedin: true,
        linkedin_post_id: linkedInPostId,
        linkedin_post_url: linkedInPostUrl
      })
      .eq('id', post_id);

    console.log('Successfully posted to LinkedIn:', {
      userId: user.id,
      postId: post_id,
      linkedInPostId
    });

    return new Response(JSON.stringify({
      success: true,
      linkedin_post_id: linkedInPostId,
      linkedin_post_url: linkedInPostUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('LinkedIn posting error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to post to LinkedIn',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
