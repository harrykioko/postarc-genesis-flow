
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCorsPreflightRequest, createErrorResponse } from './utils/cors.ts'
import { getUserFromToken, extractTokenFromHeader } from './utils/auth.ts'
import { handleInitiate } from './handlers/initiate.ts'
import { handleCallback } from './handlers/callback.ts'
import { handleStatus } from './handlers/status.ts'
import { handleDisconnect } from './handlers/disconnect.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest()
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
    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.error('❌ No authorization header provided')
      return createErrorResponse('No authorization header', 401)
    }

    // Extract the token from the header
    const token = extractTokenFromHeader(authHeader)
    if (!token) {
      console.error('❌ Invalid authorization header format')
      return createErrorResponse('Invalid authorization header', 401)
    }

    console.log(`🔑 Token received (first 20 chars): ${token.substring(0, 20)}...`)
    
    // Get user from token
    const user = await getUserFromToken(token)
    if (!user) {
      console.error('❌ Failed to get user from token')
      return createErrorResponse('Invalid authentication token', 401)
    }

    console.log(`👤 User authenticated: ${user.id}`)

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
          return createErrorResponse('Invalid JSON body')
        }
      } else {
        console.log('⚠️ Empty request body received')
      }
    }

    const { action } = body
    console.log(`🔄 Processing action: ${action || 'undefined'}`)

    switch (action) {
      case 'initiate':
        return await handleInitiate(user.id)

      case 'callback':
        const { code, state } = body
        return await handleCallback(user.id, code, state)

      case 'status':
        return await handleStatus(user.id)

      case 'disconnect':
        return await handleDisconnect(user.id)

      default:
        console.error(`❌ Unknown action: ${action}`)
        return createErrorResponse('Invalid action')
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
