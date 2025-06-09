
import { fetchUserData, updateDatabase } from '../utils/database.ts'
import { exchangeCodeForToken, fetchLinkedInProfile } from '../utils/linkedin.ts'
import { createErrorResponse, createSuccessResponse } from '../utils/cors.ts'

export async function handleCallback(userId: string, code: string, state: string) {
  if (!code || !state) {
    return createErrorResponse('Missing code or state parameter')
  }

  // Get user data to verify state
  const userData = await fetchUserData(userId, 'linkedin_oauth_state,linkedin_oauth_initiated_at,name,linkedin_head')

  if (!userData) {
    console.error('❌ User data not found')
    return createErrorResponse('User data not found')
  }

  if (userData.linkedin_oauth_state !== state) {
    console.error('❌ State mismatch')
    return createErrorResponse('Invalid OAuth state')
  }

  // Check if OAuth was initiated recently (within 10 minutes)
  const initiatedAt = new Date(userData.linkedin_oauth_initiated_at)
  const now = new Date()
  const diffMinutes = (now.getTime() - initiatedAt.getTime()) / 1000 / 60
  
  if (diffMinutes > 10) {
    console.error('❌ OAuth state expired')
    return createErrorResponse('OAuth session expired. Please try again.')
  }

  // Exchange code for access token
  const tokenData = await exchangeCodeForToken(code)

  // Get user profile
  const profileData = await fetchLinkedInProfile(tokenData.access_token)

  // Calculate token expiration
  const expiresAt = new Date()
  expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in)

  // Update user record with LinkedIn data
  await updateDatabase('users', userId, {
    linkedin_member_id: profileData.sub,
    linkedin_access_token: tokenData.access_token,
    linkedin_refresh_token: tokenData.refresh_token || null,
    linkedin_token_expires_at: expiresAt.toISOString(),
    linkedin_profile_url: null,
    linkedin_profile_image_url: profileData.picture || null,
    linkedin_connected_at: new Date().toISOString(),
    // Clear OAuth state
    linkedin_oauth_state: null,
    linkedin_oauth_initiated_at: null,
    // Update profile fields if not already set
    name: userData.name || profileData.name || profileData.given_name,
    linkedin_head: userData.linkedin_head || profileData.locale?.country || null
  })

  console.log('✅ LinkedIn connection saved successfully')
  return createSuccessResponse({
    profile: {
      linkedin_member_id: profileData.sub,
      name: profileData.name || profileData.given_name,
      profile_url: null,
      profile_image_url: profileData.picture || null,
      connected_at: new Date().toISOString()
    }
  })
}
