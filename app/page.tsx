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

  return (
    <main className="container mx-auto px-4 py-6 min-h-screen bg-background">
      <PageHeader title="รายการเพลง" description="ค้นหาและจัดการเพลงของคุณ" rightContent={<ThemeToggle />} />
      <Suspense fallback={<SongListSkeleton />}>
        <SongList initialSongs={songs || []} />
      </Suspense>
    </main>
  )
}
