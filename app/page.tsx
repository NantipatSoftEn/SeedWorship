import { Suspense } from "react"
import SongList from "@/components/song-list"
import { SongListSkeleton } from "@/components/skeletons/song-list-skeleton"
import { ThemeToggle } from "@/components/shadcn/theme-toggle"
import { createServerClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"

export default async function Home() {
  const supabase = createServerClient()

  // ดึงข้อมูลผู้ใช้ปัจจุบัน (ถ้ามีการล็อกอิน)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ดึงข้อมูลเพลงจาก Supabase
  const { data: songs, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching songs:", error)
  }

  // ดึงข้อมูลเพลงโปรดของผู้ใช้ (ถ้ามีการล็อกอิน)
  let favorites: Record<string, boolean> = {}
  if (user) {
    const { data: favoritesData } = await supabase.from("favorites").select("song_id").eq("user_id", user.id)

    if (favoritesData) {
      favorites = favoritesData.reduce(
        (acc, fav) => {
          acc[fav.song_id] = true
          return acc
        },
        {} as Record<string, boolean>,
      )
    }
  }

  // เพิ่มข้อมูล is_favorite ให้กับเพลง
  const songsWithFavorites =
    songs?.map((song) => ({
      ...song,
      is_favorite: favorites[song.id] || false,
    })) || []

  return (
    <main className="container mx-auto px-4 py-6 min-h-screen bg-background">
      <PageHeader title="รายการเพลง" description="ค้นหาและจัดการเพลงของคุณ" rightContent={<ThemeToggle />} />
      <Suspense fallback={<SongListSkeleton />}>
        <SongList initialSongs={songsWithFavorites} />
      </Suspense>
    </main>
  )
}
