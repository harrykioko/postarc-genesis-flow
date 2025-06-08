
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkedInProfile {
  linkedin_member_id: string;
  name: string;
  profile_url: string;
  profile_image_url?: string;
  connected_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 LinkedIn OAuth function called');
    
    // Check for auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'No authorization header provided' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.error('❌ Invalid authorization header format');
      return new Response(JSON.stringify({ 
        success: false,
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
        success: false,
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
        success: false,
        error: 'Invalid token - no user found' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ User authenticated successfully via JWT:', user.email);

    const { action, code, state } = await req.json();
    console.log('📋 Processing action:', action);

    if (action === 'initiate') {
      // Generate OAuth URL
      const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
      const redirectUri = `${Deno.env.get('FRONTEND_URL')}/connections/linkedin/callback`;
      const scope = 'profile email w_member_social';
      const randomState = crypto.randomUUID();

      console.log('🔧 Generating OAuth URL with state:', randomState);

      // Store the state in the database using admin client
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          linkedin_oauth_state: randomState,
          linkedin_oauth_initiated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('❌ Failed to store OAuth state:', updateError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to store OAuth state'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${randomState}&scope=${encodeURIComponent(scope)}`;

      console.log('✅ LinkedIn OAuth initiated for user:', user.id);

      return new Response(JSON.stringify({
        success: true,
        auth_url: authUrl,
        state: randomState
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'callback') {
      console.log('🔄 Processing OAuth callback...');
      
      // Exchange code for access token
      const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
      const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
      const redirectUri = `${Deno.env.get('FRONTEND_URL')}/connections/linkedin/callback`;

      // Verify state using admin client
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('linkedin_oauth_state')
        .eq('id', user.id)
        .single();

      if (userError || !userData || userData.linkedin_oauth_state !== state) {
        console.error('❌ Invalid state parameter:', { userError, expectedState: state, actualState: userData?.linkedin_oauth_state });
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid state parameter' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('✅ State verified, exchanging code for tokens...');

      // Exchange code for tokens
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId!,
          client_secret: clientSecret!,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        console.error('❌ LinkedIn token exchange failed:', tokenData);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Token exchange failed' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('🎯 Token exchange successful, fetching profile...');

      // Get user profile
      const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        console.error('❌ LinkedIn profile fetch failed:', profileData);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Profile fetch failed' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('👤 Profile fetched successfully:', profileData.name);

      // Store tokens and profile data using admin client
      const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
      
      const { error: profileUpdateError } = await supabaseAdmin
        .from('users')
        .update({
          linkedin_access_token: tokenData.access_token,
          linkedin_refresh_token: tokenData.refresh_token,
          linkedin_token_expires_at: expiresAt.toISOString(),
          linkedin_member_id: profileData.sub,
          linkedin_profile_url: `https://www.linkedin.com/in/${profileData.sub}`,
          linkedin_profile_image_url: profileData.picture,
          linkedin_connected_at: new Date().toISOString(),
          linkedin_oauth_state: null
        })
        .eq('id', user.id);

      if (profileUpdateError) {
        console.error('❌ Failed to store LinkedIn profile:', profileUpdateError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to store LinkedIn profile'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const profile: LinkedInProfile = {
        linkedin_member_id: profileData.sub,
        name: profileData.name,
        profile_url: `https://www.linkedin.com/in/${profileData.sub}`,
        profile_image_url: profileData.picture,
        connected_at: new Date().toISOString()
      };

      console.log('✅ LinkedIn connection successful for user:', user.id);

      return new Response(JSON.stringify({
        success: true,
        profile
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'status') {
      console.log('📊 Checking LinkedIn connection status...');
      
      // Check connection status using admin client
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('linkedin_access_token, linkedin_token_expires_at, linkedin_member_id, linkedin_profile_url, linkedin_profile_image_url, linkedin_connected_at')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('❌ Failed to fetch user LinkedIn data:', userError);
        return new Response(JSON.stringify({
          success: false,
          connection_status: 'disconnected',
          error: 'Failed to fetch connection status'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!userData || !userData.linkedin_access_token) {
        console.log('📊 LinkedIn not connected');
        return new Response(JSON.stringify({
          success: true,
          connection_status: 'disconnected'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if token is expired
      const isExpired = userData.linkedin_token_expires_at && 
        new Date(userData.linkedin_token_expires_at) < new Date();

      if (isExpired) {
        console.log('⏰ LinkedIn token expired');
        return new Response(JSON.stringify({
          success: true,
          connection_status: 'expired',
          token_expires_at: userData.linkedin_token_expires_at
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const profile: LinkedInProfile = {
        linkedin_member_id: userData.linkedin_member_id,
        name: user.email?.split('@')[0] || 'LinkedIn User',
        profile_url: userData.linkedin_profile_url || '',
        profile_image_url: userData.linkedin_profile_image_url,
        connected_at: userData.linkedin_connected_at || ''
      };

      console.log('✅ LinkedIn connected and active');

      return new Response(JSON.stringify({
        success: true,
        connection_status: 'connected',
        profile,
        token_expires_at: userData.linkedin_token_expires_at
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'disconnect') {
      console.log('🔌 Disconnecting LinkedIn...');
      
      // Disconnect LinkedIn using admin client
      const { error: disconnectError } = await supabaseAdmin
        .from('users')
        .update({
          linkedin_access_token: null,
          linkedin_refresh_token: null,
          linkedin_token_expires_at: null,
          linkedin_member_id: null,
          linkedin_profile_url: null,
          linkedin_profile_image_url: null,
          linkedin_connected_at: null,
          linkedin_oauth_state: null
        })
        .eq('id', user.id);

      if (disconnectError) {
        console.error('❌ Failed to disconnect LinkedIn:', disconnectError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to disconnect LinkedIn'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('✅ LinkedIn disconnected for user:', user.id);

      return new Response(JSON.stringify({
        success: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.error('❌ Invalid action:', action);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid action' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('💥 LinkedIn OAuth error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
