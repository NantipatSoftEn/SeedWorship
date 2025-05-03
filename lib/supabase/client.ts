import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Create a cached client that ensures only one instance exists
let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Initialize the Supabase client safely
function initializeSupabase() {
  // Using nullish coalescing assignment (??=) for better readability
  supabaseInstance ??= createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Export the singleton instance
export const supabase = initializeSupabase()

// Export a function that always returns the same instance
export function createClient() {
  return supabase
}
