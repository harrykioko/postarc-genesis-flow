
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
    console.log('🚀 Post to LinkedIn function called');
    
    // Check for auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return new Response(JSON.stringify({ 
        error: 'No authorization header provided' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.error('❌ Invalid authorization header format');
      return new Response(JSON.stringify({ 
        error: 'Invalid authorization header format' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Authorization header found');

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '');
    console.log('🔑 JWT token extracted, length:', token.length);

    // Create supabase admin client with SERVICE ROLE KEY for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Manually verify the JWT token using service role client
    console.log('🔐 Verifying JWT token with service role client...');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    console.log('🔍 JWT verification result:', {
      userFound: !!user,
      userId: user?.id,
      userEmail: user?.email,
      authError: authError?.message
    });
    
    if (authError) {
      console.error('❌ JWT verification failed:', authError);
      return new Response(JSON.stringify({ 
        error: 'Invalid or expired token',
        details: authError.message 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!user) {
      console.error('❌ No user found from JWT token');
      return new Response(JSON.stringify({ 
        error: 'Invalid token - no user found' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ User authenticated successfully via JWT:', user.email);

    const { post_id, content } = await req.json();
    console.log('📝 Processing LinkedIn post:', { post_id, contentLength: content?.length });

    if (!post_id || !content) {
      console.error('❌ Missing required fields');
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: post_id and content' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's LinkedIn token using admin client
    console.log('🔍 Fetching user LinkedIn tokens...');
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('linkedin_access_token, linkedin_token_expires_at, linkedin_member_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData.linkedin_access_token) {
      console.error('❌ LinkedIn not connected:', userError);
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
      console.error('⏰ LinkedIn token expired');
      return new Response(JSON.stringify({ 
        error: 'LinkedIn token expired. Please reconnect your account.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🔗 Posting to LinkedIn using Share API v2...');

    // Post to LinkedIn using the updated Share API v2
    const linkedInResponse = await fetch('https://api.linkedin.com/v2/shares', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userData.linkedin_access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        distribution: {
          linkedInDistributionTarget: {}
        },
        owner: `urn:li:person:${userData.linkedin_member_id}`,
        text: {
          text: content
        }
      }),
    });

    if (!linkedInResponse.ok) {
      const errorData = await linkedInResponse.json();
      console.error('❌ LinkedIn posting failed:', errorData);
      
      let errorMessage = 'Failed to post to LinkedIn';
      if (errorData.message?.includes('token')) {
        errorMessage = 'LinkedIn token expired. Please reconnect your account.';
      } else if (errorData.message?.includes('forbidden')) {
        errorMessage = 'LinkedIn posting not authorized. Please check your LinkedIn app permissions.';
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
    
    // Generate LinkedIn post URL (approximate format for Share API)
    const linkedInPostUrl = `https://www.linkedin.com/feed/update/${linkedInPostId}`;

    console.log('✅ LinkedIn post successful:', { linkedInPostId, linkedInPostUrl });

    // Update the post record with LinkedIn info using admin client
    console.log('📝 Updating post record with LinkedIn info...');
    const { error: updateError } = await supabaseAdmin
      .from('posts')
      .update({
        posted_to_linkedin: true,
        linkedin_post_id: linkedInPostId,
        linkedin_post_url: linkedInPostUrl
      })
      .eq('id', post_id);

    if (updateError) {
      console.error('❌ Failed to update post record:', updateError);
      // Note: LinkedIn post was successful, but we couldn't update our database
      // Still return success but log the error
    }

    console.log('✅ Successfully posted to LinkedIn and updated database:', {
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
    console.error('💥 LinkedIn posting error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to post to LinkedIn',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
