import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// สร้าง Supabase client สำหรับใช้งานฝั่ง server
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// เพิ่ม alias สำหรับ createServerClient เพื่อให้สามารถเรียกใช้ได้จากไฟล์อื่น
export const createServerClient = createServerSupabaseClient
