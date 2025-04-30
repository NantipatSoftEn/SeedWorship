"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"
import type { Song, SongFormData } from "@/types/song"
import { autoConvertChordFormat } from "@/utils/chord-formatter"

// สร้าง Supabase client สำหรับใช้งานใน server actions
const createClient = () => {
  const cookieStore = cookies()
  return createServerActionClient<Database>({ cookies: () => cookieStore })
}

// ดึงข้อมูลเพลงทั้งหมด
export async function getSongs(): Promise<Song[]> {
  const supabase = createClient()

  // ตรวจสอบว่ามีผู้ใช้ที่ล็อกอินอยู่หรือไม่
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ดึงข้อมูลเพลงทั้งหมด
  const { data: songs, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching songs:", error)
    return []
  }

  // ถ้ามีผู้ใช้ที่ล็อกอินอยู่ ให้ตรวจสอบว่าเพลงไหนเป็นเพลงโปรดของผู้ใช้
  if (user) {
    const { data: favorites } = await supabase.from("favorites").select("song_id").eq("user_id", user.id)

    const favoriteIds = favorites?.map((fav) => fav.song_id) || []

    // เพิ่มข้อมูล is_favorite ให้กับเพลง
    return songs.map((song) => ({
      ...song,
      is_favorite: favoriteIds.includes(song.id),
    }))
  }

  return songs
}

// ดึงข้อมูลเพลงตาม ID
export async function getSongById(id: string): Promise<Song | null> {
  const supabase = createClient()

  const { data: song, error } = await supabase.from("songs").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching song:", error)
    return null
  }

  return song
}

// เพิ่มเพลงใหม่
export async function addSong(songData: SongFormData): Promise<{ success: boolean; message: string; song?: Song }> {
  const supabase = createClient()

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่ล็อกอินอยู่หรือไม่
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "กรุณาเข้าสู่ระบบก่อนเพิ่มเพลง" }
    }

    // แปลงรูปแบบคอร์ดโดยอัตโนมัติ
    const formattedLyrics = autoConvertChordFormat(songData.lyrics)

    // เพิ่มเพลงใหม่
    const { data, error } = await supabase
      .from("songs")
      .insert({
        title: songData.title,
        artist: songData.artist,
        category: songData.category,
        language: songData.language,
        lyrics: formattedLyrics,
        tags: songData.tags,
        user_id: user.id,
        show_chords: true,
      })
      .select()

    if (error) {
      console.error("Error adding song:", error)
      return { success: false, message: `เกิดข้อผิดพลาด: ${error.message}` }
    }

    revalidatePath("/")
    return { success: true, message: "เพิ่มเพลงสำเร็จ", song: data[0] }
  } catch (error) {
    console.error("Error adding song:", error)
    return { success: false, message: "เกิดข้อผิดพลาดในการเพิ่มเพลง" }
  }
}

// อัปเดตเพลง
export async function updateSong(
  id: string,
  songData: Partial<SongFormData>,
): Promise<{ success: boolean; message: string; song?: Song }> {
  const supabase = createClient()

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่ล็อกอินอยู่หรือไม่
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "กรุณาเข้าสู่ระบบก่อนแก้ไขเพลง" }
    }

    // ตรวจสอบว่าเพลงนี้เป็นของผู้ใช้หรือไม่
    const { data: song } = await supabase.from("songs").select("user_id").eq("id", id).single()

    if (song?.user_id !== user.id) {
      return { success: false, message: "คุณไม่มีสิทธิ์แก้ไขเพลงนี้" }
    }

    // แปลงรูปแบบคอร์ดโดยอัตโนมัติ (ถ้ามีการแก้ไขเนื้อเพลง)
    const updateData: any = { ...songData }
    if (songData.lyrics) {
      updateData.lyrics = autoConvertChordFormat(songData.lyrics)
    }

    // อัปเดตเพลง
    const { data, error } = await supabase.from("songs").update(updateData).eq("id", id).select()

    if (error) {
      console.error("Error updating song:", error)
      return { success: false, message: `เกิดข้อผิดพลาด: ${error.message}` }
    }

    revalidatePath("/")
    return { success: true, message: "แก้ไขเพลงสำเร็จ", song: data[0] }
  } catch (error) {
    console.error("Error updating song:", error)
    return { success: false, message: "เกิดข้อผิดพลาดในการแก้ไขเพลง" }
  }
}

// ลบเพลง
export async function deleteSong(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่ล็อกอินอยู่หรือไม่
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "กรุณาเข้าสู่ระบบก่อนลบเพลง" }
    }

    // ตรวจสอบว่าเพลงนี้เป็นของผู้ใช้หรือไม่
    const { data: song } = await supabase.from("songs").select("user_id").eq("id", id).single()

    if (song?.user_id !== user.id) {
      return { success: false, message: "คุณไม่มีสิทธิ์ลบเพลงนี้" }
    }

    // ลบเพลง
    const { error } = await supabase.from("songs").delete().eq("id", id)

    if (error) {
      console.error("Error deleting song:", error)
      return { success: false, message: `เกิดข้อผิดพลาด: ${error.message}` }
    }

    revalidatePath("/")
    return { success: true, message: "ลบเพลงสำเร็จ" }
  } catch (error) {
    console.error("Error deleting song:", error)
    return { success: false, message: "เกิดข้อผิดพลาดในการลบเพลง" }
  }
}

// เพิ่ม/ลบเพลงโปรด
export async function toggleFavorite(
  songId: string,
): Promise<{ success: boolean; message: string; is_favorite: boolean }> {
  const supabase = createClient()

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่ล็อกอินอยู่หรือไม่
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "กรุณาเข้าสู่ระบบก่อนเพิ่ม/ลบเพลงโปรด", is_favorite: false }
    }

    // ตรวจสอบว่าเพลงนี้เป็นเพลงโปรดของผู้ใช้หรือไม่
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("song_id", songId)
      .single()

    if (favorite) {
      // ถ้าเป็นเพลงโปรดอยู่แล้ว ให้ลบออก
      const { error } = await supabase.from("favorites").delete().eq("id", favorite.id)

      if (error) {
        console.error("Error removing favorite:", error)
        return { success: false, message: `เกิดข้อผิดพลาด: ${error.message}`, is_favorite: true }
      }

      revalidatePath("/")
      return { success: true, message: "ลบออกจากเพลงโปรดแล้ว", is_favorite: false }
    } else {
      // ถ้ายังไม่เป็นเพลงโปรด ให้เพิ่มเข้าไป
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        song_id: songId,
      })

      if (error) {
        console.error("Error adding favorite:", error)
        return { success: false, message: `เกิดข้อผิดพลาด: ${error.message}`, is_favorite: false }
      }

      revalidatePath("/")
      return { success: true, message: "เพิ่มเข้าเพลงโปรดแล้ว", is_favorite: true }
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return { success: false, message: "เกิดข้อผิดพลาดในการเพิ่ม/ลบเพลงโปรด", is_favorite: false }
  }
}

// ดึงเพลงโปรดของผู้ใช้
export async function getFavoriteSongs(): Promise<Song[]> {
  const supabase = createClient()

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่ล็อกอินอยู่หรือไม่
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    // ดึงข้อมูลเพลงโปรดของผู้ใช้
    const { data, error } = await supabase
      .from("favorites")
      .select("songs(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching favorite songs:", error)
      return []
    }

    // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
    return data.map((item) => ({
      ...item.songs,
      is_favorite: true,
    }))
  } catch (error) {
    console.error("Error fetching favorite songs:", error)
    return []
  }
}

// อัปเดตการแสดง/ซ่อนคอร์ด
export async function toggleShowChords(
  id: string,
  showChords: boolean,
): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  try {
    const { error } = await supabase.from("songs").update({ show_chords: showChords }).eq("id", id)

    if (error) {
      console.error("Error updating show_chords:", error)
      return { success: false, message: `เกิดข้อผิดพลาด: ${error.message}` }
    }

    return { success: true, message: showChords ? "แสดงคอร์ดแล้ว" : "ซ่อนคอร์ดแล้ว" }
  } catch (error) {
    console.error("Error toggling show_chords:", error)
    return { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตการแสดง/ซ่อนคอร์ด" }
  }
}
