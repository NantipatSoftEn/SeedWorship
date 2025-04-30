import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SongDetail } from "@/components/song-detail"
import { PageHeader } from "@/components/page-header"
// แก้ไข import path ของ ThemeToggle
import { ThemeToggle } from "@/components/shadcn/theme-toggle"
// แทนที่
// import { ThemeToggle } from "@/components/ui/theme-toggle"

interface SongPageProps {
  params: {
    id: string
  }
}

export default async function SongPage({ params }: SongPageProps) {
  const supabase = createServerComponentClient({ cookies })

  // ดึงข้อมูลเพลงตาม ID
  const { data: song, error } = await supabase.from("songs").select("*").eq("id", params.id).single()

  // ถ้าไม่พบเพลง ให้แสดงหน้า 404
  if (error || !song) {
    notFound()
  }

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ตรวจสอบว่าเพลงนี้เป็นเพลงโปรดของผู้ใช้หรือไม่
  let isFavorite = false
  if (user) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("song_id", song.id)
      .single()

    isFavorite = !!favorite
  }

  return (
    <main className="container mx-auto px-4 py-6 min-h-screen bg-background">
      <PageHeader title={song.title} description={song.artist} rightContent={<ThemeToggle />} />

      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            กลับไปยังรายการเพลง
          </Link>
        </Button>
      </div>

      <SongDetail song={song} isFavorite={isFavorite} currentUser={user} />
    </main>
  )
}
