
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Helper function to query database
export async function queryDatabase(query: string, params: any = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Database query failed: ${response.statusText}`)
  }
  
  return await response.json()
}

// Helper function to update database
export async function updateDatabase(table: string, userId: string, data: any) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Database update failed: ${error}`)
  }
  
  return await response.json()
}
