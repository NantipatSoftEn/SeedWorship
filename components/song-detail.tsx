"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Share2, Calendar, Globe, Tag, Heart } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { ChordToggle } from "@/components/chord-toggle"
import { FontSizeAdjuster } from "@/components/shadcn/font-size-adjuster"
import { formatLyricsWithFormattedChords } from "@/utils/format-lyrics"
import { formatDate } from "@/utils/format-date"
import { useToast } from "@/hooks/use-toast"
import type { Song, SongCategory, SongLanguage, SongTag } from "@/types/song"

interface SongDetailProps {
  song: Song
  userInfo?: {
    username: string | null
    display_name: string | null
  } | null
  isFavorite: boolean
  currentUser: any | null
}

export function SongDetail({
  song,
  userInfo,
  isFavorite: initialIsFavorite,
  currentUser,
}: SongDetailProps): JSX.Element {
  const [fontSize, setFontSize] = useState<string>("medium")
  const [showChords, setShowChords] = useState<boolean>(song.show_chords ?? true)
  const [isFavorite, setIsFavorite] = useState<boolean>(initialIsFavorite)
  const [isSharing, setIsSharing] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleFontSizeChange = (size: string): void => {
    setFontSize(size)
  }

  const handleToggleChords = async (): Promise<void> => {
    setShowChords(!showChords)

    // อัปเดตการตั้งค่าการแสดง/ซ่อนคอร์ดในฐานข้อมูล (ถ้าผู้ใช้เป็นเจ้าของเพลง)
    if (currentUser && song.user_id === currentUser.id) {
      try {
        const { error } = await supabase.from("songs").update({ show_chords: !showChords }).eq("id", song.id)

        if (error) throw error
      } catch (error) {
        console.error("Error updating show_chords:", error)
      }
    }
  }

  const handleToggleFavorite = async (): Promise<void> => {
    if (!currentUser) {
      toast({
        title: "กรุณาเข้าสู่ระบบ",
        description: "กรุณาเข้าสู่ระบบก่อนเพิ่ม/ลบเพลงโปรด",
        variant: "destructive",
      })
      return
    }

    try {
      if (isFavorite) {
        // ลบออกจากเพลงโปรด
        const { data: favorite } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", currentUser.id)
          .eq("song_id", song.id)
          .single()

        if (favorite) {
          const { error } = await supabase.from("favorites").delete().eq("id", favorite.id)
          if (error) throw error
        }

        setIsFavorite(false)
        toast({
          title: "ลบออกจากเพลงโปรดแล้ว",
          description: "ลบเพลงออกจากรายการเพลงโปรดเรียบร้อยแล้ว",
        })
      } else {
        // เพิ่มเข้าเพลงโปรด
        const { error } = await supabase.from("favorites").insert({
          user_id: currentUser.id,
          song_id: song.id,
        })

        if (error) throw error

        setIsFavorite(true)
        toast({
          title: "เพิ่มเข้าเพลงโปรดแล้ว",
          description: "เพิ่มเพลงเข้ารายการเพลงโปรดเรียบร้อยแล้ว",
        })
      }

      // รีเฟรชหน้าเพื่ออัปเดตข้อมูล
      router.refresh()
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่ม/ลบเพลงโปรดได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (): Promise<void> => {
    setIsSharing(true)

    try {
      if (navigator.share) {
        // ใช้ Web Share API ถ้ารองรับ
        await navigator.share({
          title: song.title,
          text: `${song.title} - ${song.artist}`,
          url: window.location.href,
        })
      } else {
        // ถ้าไม่รองรับ Web Share API ให้คัดลอกลิงก์แทน
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "คัดลอกลิงก์แล้ว",
          description: "ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแชร์เพลงได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
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

  const formattedDate = song.created_at ? formatDate(song.created_at) : "ไม่ระบุวันที่"

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">{song.title}</h1>
            <p className="text-xl text-muted-foreground mt-1">{song.artist}</p>
            {userInfo && (
              <p className="text-sm text-muted-foreground mt-2">
                เพิ่มโดย: {userInfo.display_name || userInfo.username || "ไม่ระบุชื่อ"}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor(song.category)}>{getCategoryLabel(song.category)}</Badge>

            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ${
                isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={handleToggleFavorite}
            >
              <Heart className={isFavorite ? "h-4 w-4 fill-current" : "h-4 w-4"} />
              <span>{isFavorite ? "เพลงโปรด" : "เพิ่มเป็นเพลงโปรด"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleShare}
              disabled={isSharing}
            >
              <Share2 className="h-4 w-4" />
              <span>แชร์</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>

          {song.language && (
            <div className="flex items-center">
              <Badge variant="outline" className="font-normal">
                <Globe className="h-3 w-3 mr-1" />
                {getLanguageLabel(song.language)}
              </Badge>
            </div>
          )}

          {/* แสดง tags */}
          {song.tags && song.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {song.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal">
                  <Tag className="h-3 w-3 mr-1" />
                  {getTagLabel(tag)}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <FontSizeAdjuster onSizeChange={handleFontSizeChange} />
            <ChordToggle showChords={showChords} onToggle={handleToggleChords} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-blue-50 dark:border-blue-900">
            {formatLyricsWithFormattedChords(song.lyrics, showChords, fontSize)}
          </div>
        </div>
      </div>
    </div>
  )
}
