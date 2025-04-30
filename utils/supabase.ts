import { createClient } from "@supabase/supabase-js"

// สร้าง Supabase client สำหรับใช้ในฝั่ง client
export const createClientComponentClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// สร้าง Supabase client สำหรับใช้ในฝั่ง server
export const createServerComponentClient = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
