import { Suspense } from "react"
import SongList from "@/components/song-list"
import { SongListSkeleton } from "@/components/skeletons/song-list-skeleton"
import { ThemeToggle } from "@/components/shadcn/theme-toggle"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6 min-h-screen bg-cream-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-blue-800 dark:text-blue-300">รายการเพลง</h1>
        <ThemeToggle />
      </div>
      <Suspense fallback={<SongListSkeleton />}>
        <SongList />
      </Suspense>
    </main>
  )
}
