
import { supabase } from './auth.ts'

export async function updateDatabase(table: string, userId: string, updates: Record<string, any>) {
  const { error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', userId)

  if (error) {
    console.error(`❌ Failed to update ${table}:`, error)
    throw new Error(`Failed to update ${table}`)
  }
}

export async function fetchUserData(userId: string, columns: string) {
  const { data, error } = await supabase
    .from('users')
    .select(columns)
    .eq('id', userId)
    .single()

  if (error) {
    console.error('❌ Failed to fetch user data:', error)
    throw new Error('Failed to fetch user data')
  }

  return data
}
