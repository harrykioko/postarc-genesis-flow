
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function authenticateUser(authHeader: string | null) {
  if (!authHeader) {
    console.error('❌ No authorization header provided')
    throw new Error('No authorization header')
  }

  const token = authHeader.replace('Bearer ', '')
  
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    console.error('❌ Invalid authentication token:', authError)
    throw new Error('Invalid authentication token')
  }

  console.log(`👤 User authenticated: ${user.id} (${user.email})`)
  return user
}
