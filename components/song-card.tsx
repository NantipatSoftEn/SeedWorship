"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Edit2, Calendar, Globe, Tag, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditSongForm } from "@/components/edit-song-form"
import { DeleteSongDialog } from "@/components/delete-song-dialog"
import { ChordToggle } from "@/components/chord-toggle"
import { FontSizeAdjuster } from "@/components/shadcn/font-size-adjuster"
import { formatLyricsWithFormattedChords } from "@/utils/format-lyrics"
import { formatDate } from "@/utils/format-date"
import { cn } from "@/lib/utils"
import type { Song, SongCategory, SongLanguage, SongTag } from "@/types/song"
import type { JSX } from "react/jsx-runtime"

interface SongCardProps {
  song: Song
  searchQuery: string
  onUpdateSong?: (song: Song) => void
  onDeleteSong?: (songId: string) => void
  onToggleChords?: (songId: string, showChords: boolean) => void
  onToggleFavorite?: (songId: string) => void
}

export default function SongCard({
  song,
  searchQuery,
  onUpdateSong,
  onDeleteSong,
  onToggleChords,
  onToggleFavorite,
}: SongCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [fontSize, setFontSize] = useState("medium")
  const showChords = song.show_chords ?? true // ค่าเริ่มต้นคือแสดงคอร์ด

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleToggleChords = () => {
    if (onToggleChords) {
      onToggleChords(song.id, !showChords)
    }
  }

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(song.id)
    }
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
  }

  const getCategoryLabel = (category: string): string => {
    const categories: Record<SongCategory, string> = {
      praise: "สรรเสริญ",
      worship: "นมัสการ",
      opening: "บทเพลงเปิด",
    }
    return categories[category as SongCategory] || category
  }

  const getLanguageLabel = (language?: SongLanguage): string => {
    if (!language) return "ไทย" // ค่าเริ่มต้นเป็นภาษาไทย

    const languages: Record<SongLanguage, string> = {
      thai: "ไทย",
      english: "อังกฤษ",
      other: "อื่นๆ",
    }
    return languages[language] || "ไทย"
  }

  const getTagLabel = (tag: SongTag): string => {
    const tags: Record<SongTag, string> = {
      slow: "เพลงช้า",
      fast: "เพลงเร็ว",
      medium: "เพลงปานกลาง",
      acoustic: "อะคูสติก",
      electronic: "อิเล็กทรอนิกส์",
      hymn: "เพลงนมัสการดั้งเดิม",
      contemporary: "เพลงนมัสการร่วมสมัย",
      kids: "เพลงสำหรับเด็ก",
      other: "อื่นๆ",
    }
    return tags[tag] || tag
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<SongCategory, string> = {
      praise:
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800",
      worship: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800",
      opening:
        "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800",
    }
    return (
      colors[category as SongCategory] ||
      "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
    )
  }

  const getLyricPreview = (lyrics: string): string => {
    // ลบคอร์ดออกจากเนื้อเพลง
    const lyricsWithoutChords = lyrics.replace(/\[.*?\]/g, "")

    // แยกเนื้อเพลงเป็นบรรทัด
    const lines = lyricsWithoutChords.split("\n").filter((line) => line.trim() !== "")

    // เลือกเฉพาะ 2 บรรทัดแรกที่มีเนื้อหา
    const previewLines = lines.slice(0, 2)

    // รวมบรรทัดและตัดให้ไม่เกิน 100 ตัวอักษร
    let preview = previewLines.join(" ")
    if (preview.length > 100) {
      preview = preview.substring(0, 97) + "..."
    } else if (lines.length > 2) {
      preview += "..."
    }

    return preview
  }

  const highlightText = (text: string): JSX.Element => {
    if (!searchQuery) return <span>{text}</span>

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"))

    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <span key={index} className="bg-yellow-200 dark:bg-yellow-900 font-medium">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </>
    )
  }

  const handleSongUpdate = (updatedSong: Song) => {
    if (onUpdateSong) {
      onUpdateSong(updatedSong)
    }
  }

  const handleSongDelete = (songId: string) => {
    if (onDeleteSong) {
      onDeleteSong(songId)
    }
  }

  const formattedDate = song.created_at ? formatDate(song.created_at) : "ไม่ระบุวันที่"

  return (
    <>
      <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border transition-all hover:shadow-md">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-primary">
                <Link href={`/songs/${song.id}`} className="hover:underline">
                  {highlightText(song.title)}
                </Link>
              </h3>
              <p className="text-muted-foreground">{highlightText(song.artist)}</p>

              {/* เพิ่ม preview เนื้อเพลง */}
              <p className="text-muted-foreground text-sm font-sarabun line-clamp-2">
                {highlightText(getLyricPreview(song.lyrics))}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formattedDate}</span>
                </div>
                {song.language && (
                  <div className="flex items-center text-xs">
                    <Badge variant="outline" className="font-normal text-xs py-0 px-1.5">
                      <Globe className="h-2.5 w-2.5 mr-1" />
                      {getLanguageLabel(song.language)}
                    </Badge>
                  </div>
                )}

                {/* แสดง tags */}
                {song.tags && song.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {song.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="font-normal text-xs py-0 px-1.5">
                        <Tag className="h-2.5 w-2.5 mr-1" />
                        {getTagLabel(tag)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{getCategoryLabel(song.category)}</Badge>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => setIsEditFormOpen(true)}
                aria-label="แก้ไขเพลง"
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <DeleteSongDialog song={song} onDeleteSong={handleSongDelete} />

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 rounded-full",
                  song.is_favorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
                )}
                onClick={handleToggleFavorite}
                aria-label={song.is_favorite ? "ลบออกจากเพลงโปรด" : "เพิ่มเข้าเพลงโปรด"}
              >
                <Heart className={cn("h-4 w-4", song.is_favorite ? "fill-current" : "")} />
              </Button>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-muted-foreground" asChild>
                <Link href={`/songs/${song.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full text-muted-foreground"
                onClick={toggleExpand}
                aria-label={isExpanded ? "ซ่อนเนื้อเพลง" : "แสดงเนื้อเพลง"}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 pt-0">
            <div className="border-t border-border pt-3 mt-1">
              <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                <FontSizeAdjuster onSizeChange={handleFontSizeChange} />
                <ChordToggle showChords={showChords} onToggle={handleToggleChords} />
              </div>
              {formatLyricsWithFormattedChords(song.lyrics, showChords, fontSize)}
            </div>
          </div>
        )}
      </div>

      <EditSongForm
        song={song}
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onUpdateSong={handleSongUpdate}
      />
    </>
  )
}
