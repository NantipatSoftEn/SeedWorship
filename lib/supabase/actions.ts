"use server"

import { createServerSupabaseClient } from "./server"
import { revalidatePath } from "next/cache"
import type { Database } from "./database.types"

type Song = Database["public"]["Tables"]["songs"]["Row"]
type SongKey = Database["public"]["Tables"]["song_keys"]["Row"]

/**
 * ฟังก์ชันสำหรับดึงข้อมูลเพลงทั้งหมด
 */
export async function getSongs(): Promise<Song[]> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("title", { ascending: true })

    if (error) {
        console.error("Error fetching songs:", error)
        throw new Error("Failed to fetch songs")
    }

    return data || []
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลคีย์ทั้งหมด
 */
export async function getSongKeys(): Promise<SongKey[]> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
        .from("song_keys")
        .select("*")
        .order("key_name", { ascending: true })

    if (error) {
        console.error("Error fetching song keys:", error)
        throw new Error("Failed to fetch song keys")
    }

    return data || []
}

/**
 * ฟังก์ชันสำหรับอัปเดตคีย์หลักของเพลง
 */
export async function updateSongPrimaryKey(songId: string, keyId: string): Promise<void> {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
        .from("songs")
        .update({ primary_key_id: keyId })
        .eq("id", songId)

    if (error) {
        console.error("Error updating song primary key:", error)
        throw new Error("Failed to update song primary key")
    }

    revalidatePath(`/songs/${songId}`)
    revalidatePath("/songs")
}

/**
 * ฟังก์ชันสำหรับเพิ่มคีย์ให้กับเพลง
 */
export async function addSongKey(songId: string, keyId: string): Promise<void> {
    const supabase = createServerSupabaseClient()

    // ตรวจสอบว่ามีความสัมพันธ์นี้อยู่แล้วหรือไม่
    const { data: existingRelation, error: checkError } = await supabase
        .from("song_to_keys")
        .select("*")
        .eq("song_id", songId)
        .eq("key_id", keyId)
        .maybeSingle()

    if (checkError) {
        console.error("Error checking existing song key relation:", checkError)
        throw new Error("Failed to check existing song key relation")
    }

    // ถ้ายังไม่มีความสัมพันธ์นี้ ให้เพิ่มเข้าไป
    if (!existingRelation) {
        const { error } = await supabase
            .from("song_to_keys")
            .insert({ song_id: songId, key_id: keyId })

        if (error) {
            console.error("Error adding song key:", error)
            throw new Error("Failed to add song key")
        }
    }

    revalidatePath(`/songs/${songId}`)
}

/**
 * ฟังก์ชันสำหรับลบคีย์ออกจากเพลง
 */
export async function removeSongKey(songId: string, keyId: string): Promise<void> {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
        .from("song_to_keys")
        .delete()
        .eq("song_id", songId)
        .eq("key_id", keyId)

    if (error) {
        console.error("Error removing song key:", error)
        throw new Error("Failed to remove song key")
    }

    revalidatePath(`/songs/${songId}`)
}
