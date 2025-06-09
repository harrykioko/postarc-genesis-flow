
import { fetchUserData } from '../utils/database.ts'
import { createSuccessResponse } from '../utils/cors.ts'

export async function handleStatus(userId: string) {
  // Check LinkedIn connection status
  const userData = await fetchUserData(userId, 'linkedin_member_id,linkedin_access_token,linkedin_token_expires_at,name,linkedin_profile_url,linkedin_profile_image_url,linkedin_connected_at')

  if (!userData) {
    console.error('❌ User data not found')
    return createSuccessResponse({
      connection_status: 'disconnected',
      error: 'User not found' 
    })
  }

  // Check if LinkedIn is connected
  if (!userData.linkedin_access_token || !userData.linkedin_member_id) {
    return createSuccessResponse({
      connection_status: 'disconnected'
    })
  }

  // Check if token is expired
  const tokenExpiry = new Date(userData.linkedin_token_expires_at)
  const isExpired = tokenExpiry < new Date()

  return createSuccessResponse({
    connection_status: isExpired ? 'expired' : 'connected',
    profile: isExpired ? undefined : {
      linkedin_member_id: userData.linkedin_member_id,
      name: userData.name,
      profile_url: userData.linkedin_profile_url,
      profile_image_url: userData.linkedin_profile_image_url,
      connected_at: userData.linkedin_connected_at
    },
    token_expires_at: userData.linkedin_token_expires_at
  })
}
