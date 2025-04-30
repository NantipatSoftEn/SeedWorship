"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Heart } from "lucide-react"
import SongCard from "@/components/song-card"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/supabase/database.types"
import type { Song } from "@/types/song"

interface UserFavoritesListProps {
  userId: string
}

export function UserFavoritesList({ userId }: UserFavoritesListProps): JSX.Element {
  const [favorites, setFavorites] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  // ดึงข้อมูลเพลงโปรดของผู้ใช้
  const fetchFavorites = async () => {
    try {
      setIsLoading(true)

      const { data, error } = await supabase
        .from("favorites")
        .select("songs(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
      const formattedFavorites =
        data?.map((item) => ({
          ...item.songs,
          is_favorite: true,
        })) || []

      setFavorites(formattedFavorites)
    } catch (error) {
      console.error("Error fetching favorites:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลเพลงโปรดได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()

    // สร้าง subscription เพื่อรับการเปลี่ยนแปลงของข้อมูลเพลงโปรด
    const subscription = supabase
      .channel("favorites_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "favorites",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchFavorites()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, supabase, toast])

  // ฟังก์ชันสำหรับลบเพลงโปรด
  const handleRemoveFavorite = async (songId: string) => {
    try {
      const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("song_id", songId)

      if (error) {
        throw error
      }

      setFavorites((prevFavorites) => prevFavorites.filter((song) => song.id !== songId))

      toast({
        title: "ลบออกจากเพลงโปรดแล้ว",
        description: "ลบเพลงออกจากรายการเพลงโปรดเรียบร้อยแล้ว",
      })
    } catch (error) {
      console.error("Error removing favorite:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบเพลงออกจากรายการเพลงโปรดได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    }
  }

  // ฟังก์ชันสำหรับอัปเดตการแสดง/ซ่อนคอร์ด
  const handleToggleChords = (songId: string, showChords: boolean) => {
    setFavorites((prevFavorites) =>
      prevFavorites.map((song) => (song.id === songId ? { ...song, show_chords: showChords } : song)),
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">เพลงโปรด</h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">เพลงโปรด</h3>

      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              searchQuery=""
              onToggleChords={handleToggleChords}
              onToggleFavorite={handleRemoveFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-blue-50 dark:border-blue-900">
          <p className="text-gray-500 dark:text-gray-400 mb-4">คุณยังไม่มีเพลงโปรด</p>
          <Heart className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500" />
          <p className="text-gray-500 dark:text-gray-400 mt-2">กดที่ไอคอนหัวใจบนเพลงที่คุณชื่นชอบเพื่อเพิ่มเข้ารายการเพลงโปรด</p>
        </div>
      )}
    </div>
  )
}
