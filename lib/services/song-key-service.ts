import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"

export type SongKey = Database["public"]["Tables"]["song_keys"]["Row"]
export type SongToKey = Database["public"]["Tables"]["song_to_keys"]["Row"]

/**
 * ดึงข้อมูลคีย์ทั้งหมด
 */
export async function getAllKeys(): Promise<SongKey[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("song_keys").select("*").order("key_name")

    if (error) {
        console.error("Error fetching keys:", error)
        throw error
    }

    return data || []
}

/**
 * ดึงข้อมูลคีย์ทั้งหมดของเพลง
 */
export async function getSongKeys(songId: string): Promise<SongKey[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("song_to_keys")
        .select("key_id, song_keys(id, key_name, created_at)")
        .eq("song_id", songId)

    if (error) {
        console.error("Error fetching song keys:", error)
        throw error
    }

    // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
    return data?.map((item) => item.song_keys as SongKey) || []
}

/**
 * ดึงข้อมูลคีย์หลักของเพลง
 */
export async function getSongPrimaryKey(songId: string): Promise<SongKey | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("songs")
        .select("primary_key_id, song_keys!inner(id, key_name, created_at)")
        .eq("id", songId)
        .single()

    if (error) {
        console.error("Error fetching song primary key:", error)
        throw error
    }

    return (data?.song_keys as SongKey) || null
}

/**
 * เพิ่มคีย์ให้กับเพลง
 */
export async function addKeyToSong(songId: string, keyId: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
        .from("song_to_keys")
        .insert({ song_id: songId, key_id: keyId })
        .select()

    if (error) {
        // ถ้าเป็น unique violation (คีย์นี้มีอยู่แล้ว) ให้ข้ามไป
        if (error.code !== "23505") {
            console.error("Error adding key to song:", error)
            throw error
        }
    }
}

/**
 * ตั้งค่าคีย์หลักของเพลง
 */
export async function setPrimarySongKey(songId: string, keyId: string): Promise<void> {
    const supabase = createClient()

    // ตรวจสอบว่าคีย์นี้เป็นหนึ่งในคีย์ของเพลงหรือไม่
    const { data: existingKey } = await supabase
        .from("song_to_keys")
        .select("id")
        .eq("song_id", songId)
        .eq("key_id", keyId)
        .single()

    // ถ้าคีย์นี้ยังไม่มีในเพลง ให้เพิ่มเข้าไปก่อน
    if (!existingKey) {
        await addKeyToSong(songId, keyId)
    }

    // ตั้งค่าคีย์หลัก
    const { error } = await supabase
        .from("songs")
        .update({ primary_key_id: keyId })
        .eq("id", songId)

    if (error) {
        console.error("Error setting primary key:", error)
        throw error
    }
}

/**
 * ลบคีย์ออกจากเพลง
 */
export async function removeKeyFromSong(songId: string, keyId: string): Promise<void> {
    const supabase = createClient()

    // ตรวจสอบว่าคีย์นี้เป็นคีย์หลักหรือไม่
    const { data: song } = await supabase
        .from("songs")
        .select("primary_key_id")
        .eq("id", songId)
        .single()

    // ถ้าคีย์นี้เป็นคีย์หลัก ให้เคลียร์ค่าคีย์หลักก่อน
    if (song?.primary_key_id === keyId) {
        await supabase.from("songs").update({ primary_key_id: null }).eq("id", songId)
    }

    // ลบคีย์ออกจากเพลง
    const { error } = await supabase
        .from("song_to_keys")
        .delete()
        .eq("song_id", songId)
        .eq("key_id", keyId)

    if (error) {
        console.error("Error removing key from song:", error)
        throw error
    }
}

/**
 * สร้างคีย์ใหม่
 */
export async function createKey(keyName: string): Promise<SongKey> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("song_keys")
        .insert({ key_name: keyName })
        .select()
        .single()

    if (error) {
        console.error("Error creating key:", error)
        throw error
    }

    return data
}
