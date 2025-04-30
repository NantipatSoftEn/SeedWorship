import { createClient } from "@supabase/supabase-js"

// Singleton instances for client and server
let clientInstance: ReturnType<typeof createClient> | null = null
let serverInstance: ReturnType<typeof createClient> | null = null

// สร้าง Supabase client สำหรับใช้ในฝั่ง client
export const createClientComponentClient = () => {
    clientInstance ??= createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  return clientInstance
}

// สร้าง Supabase client สำหรับใช้ในฝั่ง server
export const createServerComponentClient = () => {
  serverInstance ??= createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  return serverInstance
}
