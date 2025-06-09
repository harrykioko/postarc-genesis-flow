// supabase/functions/linkedin-oauth-connect/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// LinkedIn OAuth Configuration
const LINKEDIN_CLIENT_ID = Deno.env.get('LINKEDIN_CLIENT_ID')!
const LINKEDIN_CLIENT_SECRET = Deno.env.get('LINKEDIN_CLIENT_SECRET')!
const LINKEDIN_REDIRECT_URI = Deno.env.get('LINKEDIN_REDIRECT_URI')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// LinkedIn OAuth URLs
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization'
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
const LINKEDIN_PROFILE_URL = 'https://api.linkedin.com/v2/userinfo'

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    // Get the authorization header - Supabase sends it as 'Authorization'
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) {
      console.error('❌ No authorization header provided')
      console.log('Available headers:', Array.from(req.headers.keys()))
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extract the token from the header
    const token = authHeader.replace('Bearer ', '').trim()
    console.log(`🔑 Token received (first 20 chars): ${token.substring(0, 20)}...`)
    
    // Use the service role client to verify the user's token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      console.error('❌ Failed to get user from token:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token', details: authError?.message }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`👤 User authenticated: ${user.id} (${user.email})`)

    // Parse request body safely
    let body: any = {}
    
    // Check if request has a body
    const contentType = req.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const bodyText = await req.text()
      console.log(`📦 Request body length: ${bodyText.length}`)
      
      if (bodyText.length > 0) {
        try {
          body = JSON.parse(bodyText)
          console.log(`✅ Parsed body:`, JSON.stringify(body))
        } catch (parseError) {
          console.error('❌ Failed to parse JSON body:', parseError)
          return new Response(
            JSON.stringify({ error: 'Invalid JSON body' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
      } else {
        console.log('⚠️ Empty request body received')
      }
    }

    const { action } = body

    console.log(`🔄 Processing action: ${action || 'undefined'}`)

    switch (action) {
      case 'initiate': {
        // Generate a unique state for CSRF protection
        const state = crypto.randomUUID()
        
        // Store the state in the user's database record
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            linkedin_oauth_state: state,
            linkedin_oauth_initiated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('❌ Failed to update user state:', updateError)
          throw new Error('Failed to initiate OAuth flow')
        }

        // Construct the LinkedIn authorization URL
        const params = new URLSearchParams({
          response_type: 'code',
          client_id: LINKEDIN_CLIENT_ID,
          redirect_uri: LINKEDIN_REDIRECT_URI,
          state: state,
          scope: 'openid profile email w_member_social'
        })

        const authUrl = `${LINKEDIN_AUTH_URL}?${params.toString()}`
        
        console.log('✅ LinkedIn OAuth URL generated')
        return new Response(
          JSON.stringify({ 
            success: true, 
            auth_url: authUrl,
            state: state 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      case 'callback': {
        const { code, state } = body

        if (!code || !state) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Missing code or state parameter' 
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Verify state matches what we stored
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('linkedin_oauth_state, linkedin_oauth_initiated_at')
          .eq('id', user.id)
          .single()

        if (userError || !userData) {
          console.error('❌ Failed to fetch user data:', userError)
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Failed to verify OAuth state' 
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        if (userData.linkedin_oauth_state !== state) {
          console.error('❌ State mismatch')
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid OAuth state' 
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Check if OAuth was initiated recently (within 10 minutes)
        const initiatedAt = new Date(userData.linkedin_oauth_initiated_at)
        const now = new Date()
        const diffMinutes = (now.getTime() - initiatedAt.getTime()) / 1000 / 60
        
        if (diffMinutes > 10) {
          console.error('❌ OAuth state expired')
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'OAuth session expired. Please try again.' 
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Exchange code for access token
        const tokenParams = new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
          redirect_uri: LINKEDIN_REDIRECT_URI
        })

        console.log('🔄 Exchanging code for access token...')
        const tokenResponse = await fetch(LINKEDIN_TOKEN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: tokenParams.toString()
        })

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text()
          console.error('❌ Token exchange failed:', errorText)
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Failed to exchange code for token' 
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const tokenData = await tokenResponse.json()
        console.log('✅ Access token received')

        // Get user profile
        console.log('🔄 Fetching LinkedIn profile...')
        const profileResponse = await fetch(LINKEDIN_PROFILE_URL, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        })

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text()
          console.error('❌ Profile fetch failed:', errorText)
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Failed to fetch LinkedIn profile' 
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const profileData = await profileResponse.json()
        console.log('✅ LinkedIn profile fetched:', profileData.sub)

        // Calculate token expiration
        const expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in)

        // Update user record with LinkedIn data
        const { error: updateError } = await supabase
          .from('users')
          .update({
            linkedin_member_id: profileData.sub,
            linkedin_access_token: tokenData.access_token,
            linkedin_refresh_token: tokenData.refresh_token || null,
            linkedin_token_expires_at: expiresAt.toISOString(),
            linkedin_profile_url: `https://www.linkedin.com/in/${profileData.sub}`,
            linkedin_profile_image_url: profileData.picture || null,
            linkedin_connected_at: new Date().toISOString(),
            // Clear OAuth state
            linkedin_oauth_state: null,
            linkedin_oauth_initiated_at: null,
            // Update profile fields if not already set
            name: userData.name || profileData.name || profileData.given_name,
            linkedin_head: userData.linkedin_head || profileData.locale?.country || null
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('❌ Failed to update user record:', updateError)
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Failed to save LinkedIn connection' 
            }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('✅ LinkedIn connection saved successfully')
        return new Response(
          JSON.stringify({ 
            success: true,
            profile: {
              linkedin_member_id: profileData.sub,
              name: profileData.name || profileData.given_name,
              profile_url: `https://www.linkedin.com/in/${profileData.sub}`,
              profile_image_url: profileData.picture || null,
              connected_at: new Date().toISOString()
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      case 'status': {
        // Check LinkedIn connection status
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('linkedin_member_id, linkedin_access_token, linkedin_token_expires_at, name, linkedin_profile_url, linkedin_profile_image_url, linkedin_connected_at')
          .eq('id', user.id)
          .single()

        if (userError || !userData) {
          console.error('❌ Failed to fetch user data:', userError)
          return new Response(
            JSON.stringify({ 
              success: false,
              connection_status: 'disconnected',
              error: 'Failed to check connection status' 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Check if LinkedIn is connected
        if (!userData.linkedin_access_token || !userData.linkedin_member_id) {
          return new Response(
            JSON.stringify({ 
              success: true,
              connection_status: 'disconnected'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Check if token is expired
        const tokenExpiry = new Date(userData.linkedin_token_expires_at)
        const isExpired = tokenExpiry < new Date()

        return new Response(
          JSON.stringify({ 
            success: true,
            connection_status: isExpired ? 'expired' : 'connected',
            profile: isExpired ? undefined : {
              linkedin_member_id: userData.linkedin_member_id,
              name: userData.name,
              profile_url: userData.linkedin_profile_url,
              profile_image_url: userData.linkedin_profile_image_url,
              connected_at: userData.linkedin_connected_at
            },
            token_expires_at: userData.linkedin_token_expires_at
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      case 'disconnect': {
        // Clear LinkedIn connection data
        const { error: updateError } = await supabase
          .from('users')
          .update({
            linkedin_member_id: null,
            linkedin_access_token: null,
            linkedin_refresh_token: null,
            linkedin_token_expires_at: null,
            linkedin_profile_url: null,
            linkedin_profile_image_url: null,
            linkedin_connected_at: null,
            linkedin_oauth_state: null,
            linkedin_oauth_initiated_at: null
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('❌ Failed to disconnect LinkedIn:', updateError)
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Failed to disconnect LinkedIn' 
            }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('✅ LinkedIn disconnected successfully')
        return new Response(
          JSON.stringify({ success: true }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      default: {
        console.error(`❌ Unknown action: ${action}`)
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid action' 
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})