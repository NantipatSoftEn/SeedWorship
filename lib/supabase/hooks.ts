"use client"

import { useEffect, useState } from "react"
import { supabase } from "./client"
import type { Database } from "./database.types"

/**
 * Hook สำหรับดึงข้อมูลเพลงทั้งหมด
 */
export const useSongs = () => {
    type Song = Database["public"]["Tables"]["songs"]["Row"]

    const [songs, setSongs] = useState<Song[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from("songs")
                    .select("*")
                    .order("title", { ascending: true })

                if (error) {
                    throw error
                }

                setSongs(data || [])
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error occurred"))
            } finally {
                setLoading(false)
            }
        }

        fetchSongs()
    }, [])

    return { songs, loading, error }
}

/**
 * Hook สำหรับดึงข้อมูลคีย์ทั้งหมด
 */
export const useSongKeys = () => {
    type SongKey = Database["public"]["Tables"]["song_keys"]["Row"]

    const [keys, setKeys] = useState<SongKey[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from("song_keys")
                    .select("*")
                    .order("key_name", { ascending: true })

                if (error) {
                    throw error
                }

                setKeys(data || [])
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error occurred"))
            } finally {
                setLoading(false)
            }
        }

        fetchKeys()
    }, [])

    return { keys, loading, error }
}

/**
 * Hook สำหรับดึงข้อมูลคีย์ของเพลงที่ระบุ
 */
export const useSongWithKeys = (songId: string) => {
    type Song = Database["public"]["Tables"]["songs"]["Row"]
    type SongKey = Database["public"]["Tables"]["song_keys"]["Row"]

    const [song, setSong] = useState<Song | null>(null)
    const [songKeys, setSongKeys] = useState<SongKey[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchSongWithKeys = async () => {
            try {
                setLoading(true)

                // ดึงข้อมูลเพลง
                const { data: songData, error: songError } = await supabase
                    .from("songs")
                    .select("*")
                    .eq("id", songId)
                    .single()

                if (songError) {
                    throw songError
                }

                setSong(songData)

                // ดึงข้อมูลคีย์ของเพลง
                const { data: keysData, error: keysError } = await supabase
                    .from("song_to_keys")
                    .select("song_keys(*)")
                    .eq("song_id", songId)

                if (keysError) {
                    throw keysError
                }

                const keys = keysData.map((item) => item.song_keys as SongKey)
                setSongKeys(keys)
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error occurred"))
            } finally {
                setLoading(false)
            }
        }

        if (songId) {
            fetchSongWithKeys()
        }
    }, [songId])

    return { song, songKeys, loading, error }
}
