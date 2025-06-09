
import { updateDatabase } from '../utils/database.ts'
import { generateAuthUrl } from '../utils/linkedin.ts'
import { createSuccessResponse } from '../utils/cors.ts'

export async function handleInitiate(userId: string) {
  // Generate a unique state for CSRF protection
  const state = crypto.randomUUID()
  
  // Update user record with state
  await updateDatabase('users', userId, {
    linkedin_oauth_state: state,
    linkedin_oauth_initiated_at: new Date().toISOString()
  })

  // Construct the LinkedIn authorization URL
  const authUrl = generateAuthUrl(state)
  
  console.log('✅ LinkedIn OAuth URL generated')
  return createSuccessResponse({ 
    auth_url: authUrl,
    state: state 
  })
}
