
import { updateDatabase } from '../utils/database.ts'
import { createSuccessResponse } from '../utils/cors.ts'

export async function handleDisconnect(userId: string) {
  // Clear LinkedIn connection data
  await updateDatabase('users', userId, {
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

  console.log('✅ LinkedIn disconnected successfully')
  return createSuccessResponse({})
}
