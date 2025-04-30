"use client"

import { useState, useEffect } from "react"
import { SongCard } from "@/components/shadcn/song-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search, RefreshCw } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@/utils/supabase"
import type { SongWithUser } from "@/types/song"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface SongListProps {
  initialSongs?: SongWithUser[]
}

export function SongList({ initialSongs = [] }: SongListProps) {
  const [songs, setSongs] = useState<SongWithUser[]>(initialSongs)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const session = useAuth()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const fetchSongs = async () => {
    setIsLoading(true)
    try {
      const { data: songsData, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      // ดึงข้อมูลผู้ใช้สำหรับแต่ละเพลง (ถ้ามี user_id)
      const songsWithUsers = await Promise.all(
        songsData.map(async (song) => {
          if (song.user_id) {
            const { data: userData, error: userError } = await supabase
              .from("profiles")
              .select("id, username, display_name, avatar_url")
              .eq("id", song.user_id)
              .single()

            if (!userError && userData) {
              return { ...song, user: userData }
            }
          }
          return song
        }),
      )

      setSongs(songsWithUsers)
    } catch (error) {
      console.error("Error fetching songs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch songs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSongs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    if (!session.user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to delete songs.",
        variant: "destructive",
      })
      return
    }

    if (window.confirm("Are you sure you want to delete this song?")) {
      try {
        const { error } = await supabase.from("songs").delete().eq("id", id)

        if (error) {
          throw error
        }

        setSongs(songs.filter((song) => song.id !== id))
        toast({
          title: "Success",
          description: "Song deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting song:", error)
        toast({
          title: "Error",
          description: "Failed to delete song. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredSongs = songs.filter((song) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      song.title.toLowerCase().includes(searchLower) ||
      song.artist.toLowerCase().includes(searchLower) ||
      song.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
      song.category.toLowerCase().includes(searchLower) ||
      song.language.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search songs, artists, or tags..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSongs}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </Button>
          <Link
            href="/songs/add"
            passHref
            aria-disabled={!session.user}
            tabIndex={!session.user ? -1 : undefined}
            className={!session.user ? "pointer-events-none opacity-50" : ""}
          >
            <Button variant="default" size="sm" className="flex items-center gap-1" disabled={!session.user}>
              <Plus size={16} />
              <span>Add Song</span>
            </Button>
          </Link>
        </div>
      </div>

      {isLoading && songs.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw size={24} className="mx-auto animate-spin mb-4" />
          <p className="text-muted-foreground">Loading songs...</p>
        </div>
      ) : filteredSongs.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-2">No songs found</p>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "Try a different search term" : "Add some songs to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} session={session} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {!session.user && (
        <div className="bg-muted p-4 rounded-lg mt-6">
          <p className="text-center text-sm">
            <span className="font-medium">Note:</span> You need to{" "}
            <Link href="/login" className="text-primary underline">
              sign in
            </Link>{" "}
            to add, edit, or delete songs.
          </p>
        </div>
      )}
    </div>
  )
}
