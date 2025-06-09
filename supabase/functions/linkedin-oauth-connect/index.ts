
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCorsPreflightRequest, createErrorResponse } from './utils/cors.ts'
import { authenticateUser } from './utils/auth.ts'
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
    return createErrorResponse('Method not allowed', 405)
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('authorization')
    const user = await authenticateUser(authHeader)

    console.log(`👤 User authenticated: ${user.id}`)

    // Parse request body safely
    let body: any = {}
    
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

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    if (error.message === 'No authorization header') {
      return createErrorResponse('Unauthorized', 401)
    }
    if (error.message === 'Invalid authentication token') {
      return createErrorResponse('Unauthorized', 401)
    }
    return createErrorResponse('Internal server error', 500)
  }
})
