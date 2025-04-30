import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import SongList from "@/components/song-list"
import { SongListSkeleton } from "@/components/skeletons/song-list-skeleton"
import { ThemeToggle } from "@/components/shadcn/theme-toggle"
import { AuthButton } from "@/components/auth/auth-button"
import { PageHeader } from "@/components/page-header"

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="container mx-auto px-4 py-6 min-h-screen bg-background">
      <PageHeader
        title="รายการเพลง"
        description="ค้นหาและจัดการเพลงของคุณ"
        rightContent={
          <div className="flex items-center gap-2">
            <AuthButton user={user} />
            <ThemeToggle />
          </div>
        }
      />
      <Suspense fallback={<SongListSkeleton />}>
        <SongList />
      </Suspense>
    </main>
  )
}
