
// LinkedIn OAuth Configuration
const LINKEDIN_CLIENT_ID = Deno.env.get('LINKEDIN_CLIENT_ID')!
const LINKEDIN_CLIENT_SECRET = Deno.env.get('LINKEDIN_CLIENT_SECRET')!
const LINKEDIN_REDIRECT_URI = Deno.env.get('LINKEDIN_REDIRECT_URI')!

// LinkedIn OAuth URLs
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization'
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
const LINKEDIN_PROFILE_URL = 'https://api.linkedin.com/v2/userinfo'

export function generateAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    state: state,
    scope: 'openid profile email w_member_social'
  })

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`
}

export async function exchangeCodeForToken(code: string): Promise<any> {
  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    client_id: LINKEDIN_CLIENT_ID,
    client_secret: LINKEDIN_CLIENT_SECRET,
    redirect_uri: LINKEDIN_REDIRECT_URI
  })

  console.log('🔄 Exchanging code for access token...')
  
  // Add timeout protection
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout
  
  try {
    const tokenResponse = await fetch(LINKEDIN_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Token exchange failed:', errorText)
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ Access token received')
    return tokenData
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      console.error('❌ Token exchange timed out')
      throw new Error('Token exchange timed out')
    }
    throw error
  }
}

export async function fetchLinkedInProfile(accessToken: string): Promise<any> {
  console.log('🔄 Fetching LinkedIn profile...')
  
  // Add timeout protection
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout
  
  try {
    const profileResponse = await fetch(LINKEDIN_PROFILE_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text()
      console.error('❌ Profile fetch failed:', errorText)
      throw new Error('Failed to fetch LinkedIn profile')
    }

    const profileData = await profileResponse.json()
    console.log('✅ LinkedIn profile fetched:', profileData.sub)
    return profileData
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      console.error('❌ Profile fetch timed out')
      throw new Error('Profile fetch timed out')
    }
    throw error
  }
}
