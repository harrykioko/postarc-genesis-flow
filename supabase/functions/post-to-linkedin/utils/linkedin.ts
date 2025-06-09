
// LinkedIn API Configuration
export const LINKEDIN_CLIENT_ID = Deno.env.get('LINKEDIN_CLIENT_ID')!
export const LINKEDIN_CLIENT_SECRET = Deno.env.get('LINKEDIN_CLIENT_SECRET')!
export const LINKEDIN_REDIRECT_URI = Deno.env.get('LINKEDIN_REDIRECT_URI')!

// LinkedIn OAuth URLs
export const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization'
export const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
export const LINKEDIN_PROFILE_URL = 'https://api.linkedin.com/v2/userinfo'

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

export async function exchangeCodeForToken(code: string) {
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
    throw new Error('Failed to exchange code for token')
  }

  return await tokenResponse.json()
}

export async function fetchLinkedInProfile(accessToken: string) {
  console.log('🔄 Fetching LinkedIn profile...')
  const profileResponse = await fetch(LINKEDIN_PROFILE_URL, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!profileResponse.ok) {
    const errorText = await profileResponse.text()
    console.error('❌ Profile fetch failed:', errorText)
    throw new Error('Failed to fetch LinkedIn profile')
  }

  return await profileResponse.json()
}
