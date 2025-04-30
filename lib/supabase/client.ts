import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// สร้าง Supabase client สำหรับใช้งานใน client components
export const createClient = () => {
  return createClientComponentClient<Database>()
}
