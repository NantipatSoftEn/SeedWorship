"use client"

import { JSX, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Plus } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import SongCard from "@/components/song-card"
import { AddSongButton } from "@/components/add-song-button"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/supabase/database.types"
import type { Song } from "@/types/song"

interface UserSongListProps {
  userId: string
}

export function UserSongList({ userId }: UserSongListProps): JSX.Element {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  // ดึงข้อมูลเพลงของผู้ใช้
  const fetchUserSongs = async () => {
    try {
      setIsLoading(true)

      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setSongs(data || [])
    } catch (error) {
      console.error("Error fetching user songs:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลเพลงได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserSongs()

    // สร้าง subscription เพื่อรับการเปลี่ยนแปลงของข้อมูลเพลง
    const subscription = supabase
      .channel("songs_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "songs",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchUserSongs()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, supabase, toast])

  // ฟังก์ชันสำหรับอัปเดตเพลง
  const handleUpdateSong = (updatedSong: Song) => {
    setSongs((prevSongs) => prevSongs.map((song) => (song.id === updatedSong.id ? updatedSong : song)))
  }

  // ฟังก์ชันสำหรับลบเพลง
  const handleDeleteSong = (songId: string) => {
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId))
  }

  // ฟังก์ชันสำหรับเพิ่มเพลงใหม่
  const handleAddSong = (newSong: Song) => {
    setSongs((prevSongs) => [newSong, ...prevSongs])
  }

  // ฟังก์ชันสำหรับอัปเดตการแสดง/ซ่อนคอร์ด
  const handleToggleChords = (songId: string, showChords: boolean) => {
    setSongs((prevSongs) => prevSongs.map((song) => (song.id === songId ? { ...song, show_chords: showChords } : song)))
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">เพลงของฉัน</h3>
          <AddSongButton onAddSong={handleAddSong} />
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">เพลงของฉัน</h3>
        <AddSongButton onAddSong={handleAddSong} />
      </div>

      {songs.length > 0 ? (
        <div className="space-y-4">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              searchQuery=""
              onUpdateSong={handleUpdateSong}
              onDeleteSong={handleDeleteSong}
              onToggleChords={handleToggleChords}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-blue-50 dark:border-blue-900">
          <p className="text-gray-500 dark:text-gray-400 mb-4">คุณยังไม่มีเพลงที่เพิ่มเข้ามา</p>
          <Button
            onClick={() => document.getElementById("add-song-button")?.click()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มเพลงใหม่
          </Button>
        </div>
      )}
    </div>
  )
}
