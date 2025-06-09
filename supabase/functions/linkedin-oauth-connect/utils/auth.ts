
interface User {
  id: string
  email?: string
}

// Helper function to get user from JWT without using Supabase client
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    // Decode JWT to get user info
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid JWT format')
      return null
    }
    
    // Decode the payload
    const payload = JSON.parse(atob(parts[1]))
    
    if (!payload.sub) {
      console.error('No user ID in token')
      return null
    }
    
    return {
      id: payload.sub,
      email: payload.email
    }
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null
  }
  return authHeader.replace('Bearer ', '').trim()
}
