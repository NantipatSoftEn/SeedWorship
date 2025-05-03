import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// สร้าง Supabase client สำหรับใช้งานฝั่ง client
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)

// เพิ่มฟังก์ชัน createClient เพื่อให้สามารถเรียกใช้ได้จากไฟล์อื่น
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}
