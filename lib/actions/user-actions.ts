"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"
import type { UserProfile } from "@/types/user"

// สร้าง Supabase client สำหรับใช้งานใน server actions
const createClient = () => {
  const cookieStore = cookies()
  return createServerActionClient<Database>({ cookies: () => cookieStore })
}

// ดึงข้อมูลโปรไฟล์ของผู้ใช้
export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient()

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่ล็อกอินอยู่หรือไม่
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    // ดึงข้อมูลโปรไฟล์ของผู้ใช้
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

// อัปเดตโปรไฟล์ของผู้ใช้
export async function updateUserProfile(
  profileData: Partial<UserProfile>,
): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่ล็อกอินอยู่หรือไม่
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "กรุณาเข้าสู่ระบบก่อนอัปเดตโปรไฟล์" }
    }

    // อัปเดตโปรไฟล์ของผู้ใช้
    const { error } = await supabase.from("profiles").update(profileData).eq("id", user.id)

    if (error) {
      console.error("Error updating user profile:", error)
      return { success: false, message: `เกิดข้อผิดพลาด: ${error.message}` }
    }

    revalidatePath("/profile")
    return { success: true, message: "อัปเดตโปรไฟล์สำเร็จ" }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์" }
  }
}

// สร้างโปรไฟล์ใหม่สำหรับผู้ใช้ที่ลงทะเบียนใหม่
export async function createUserProfile(userId: string, email: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  try {
    // สร้างชื่อผู้ใช้จากอีเมล
    const username = email.split("@")[0]

    // สร้างโปรไฟล์ใหม่
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      username,
      display_name: username,
    })

    if (error) {
      console.error("Error creating user profile:", error)
      return { success: false, message: `เกิดข้อผิดพลาด: ${error.message}` }
    }

    return { success: true, message: "สร้างโปรไฟล์สำเร็จ" }
  } catch (error) {
    console.error("Error creating user profile:", error)
    return { success: false, message: "เกิดข้อผิดพลาดในการสร้างโปรไฟล์" }
  }
}
