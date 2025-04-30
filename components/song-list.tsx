"use client"

import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Search, Filter, SlidersHorizontal, X, ArrowDownAZ, ArrowUpZA, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/shadcn/multi-select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { SearchSuggestions } from "@/components/search-suggestions"
import { SongListSkeleton } from "@/components/skeletons/song-list-skeleton"
import { AddSongButton } from "@/components/add-song-button"
import { DevModeToggle } from "@/components/dev-mode-toggle"
import SongCard from "@/components/song-card"
import { useToast } from "@/hooks/use-toast"
import { mockSongs } from "@/lib/mock-data"
import type { Song, SongTag } from "@/types/song"

const ITEMS_PER_PAGE = 10 // จำนวนเพลงต่อหน้า

// Define the categories array
const categories = [
  { label: "สรรเสริญ", value: "praise" },
  { label: "นมัสการ", value: "worship" },
  { label: "บทเพลงเปิด", value: "opening" },
]

interface SongListProps {
  initialSongs?: Song[]
}

export default function SongList({ initialSongs = [] }: SongListProps) {
  const [songs, setSongs] = useState<Song[]>(initialSongs)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(initialSongs)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [paginatedSongs, setPaginatedSongs] = useState<Song[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(initialSongs.length === 0)
  const [isDevMode, setIsDevMode] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState<boolean>(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<string>("newest")

  // แก้ไขฟังก์ชัน fetchSongs เพื่อดึงข้อมูลผู้ใช้สำหรับแต่ละเพลง
  const fetchSongs = async () => {
    try {
      setIsLoading(true)

      // ถ้าอยู่ในโหมด Dev Mode ให้ใช้ข้อมูลจำลอง
      if (isDevMode) {
        setSongs(mockSongs)
        setIsLoading(false)
        return
      }

      // ดึงข้อมูลผู้ใช้ปัจจุบัน
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // ดึงข้อมูลเพลงทั้งหมด
      const { data: songsData, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      console.log("Fetched songs:", songsData) // เพิ่มบรรทัดนี้เพื่อตรวจสอบข้อมูล

      // ถ้ามีผู้ใช้ที่ล็อกอินอยู่ ให้ตรวจสอบว่าเพลงไหนเป็นเพลงโปรดของผู้ใช้
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

      // ดึงข้อมูลผู้ใช้สำหรับแต่ละเพลง
      const songsWithUserInfo = await Promise.all(
        songsData?.map(async (song) => {
          if (song.user_id) {
            const { data: userData } = await supabase
              .from("profiles")
              .select("username, display_name")
              .eq("id", song.user_id)
              .single()

            return {
              ...song,
              is_favorite: favorites[song.id] || false,
              user_info: userData || null,
            }
          }
          return {
            ...song,
            is_favorite: favorites[song.id] || false,
            user_info: null,
          }
        }) || [],
      )

      setSongs(songsWithUserInfo)
    } catch (error) {
      console.error("Error fetching songs:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลเพลงได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // เมื่อ isDevMode เปลี่ยน ให้ดึงข้อมูลใหม่
  useEffect(() => {
    fetchSongs()
  }, [isDevMode])

  useEffect(() => {
    // ถ้ามี initialSongs ให้ใช้ initialSongs เป็นค่าเริ่มต้น
    if (initialSongs.length > 0 && !isDevMode) {
      setSongs(initialSongs)
      setIsLoading(false)
    } else {
      // ถ้าไม่มี initialSongs หรืออยู่ในโหมด Dev Mode ให้ดึงข้อมูลใหม่
      fetchSongs()
    }
  }, [initialSongs])

  // Function to update a song
  const updateSong = (updatedSong: Song) => {
    setSongs((prevSongs) => prevSongs.map((song) => (song.id === updatedSong.id ? updatedSong : song)))
  }

  // Function to add a new song
  const addSong = (newSong: Song) => {
    setSongs((prevSongs) => [newSong, ...prevSongs])
  }

  // Function to delete a song
  const deleteSong = async (songId: string) => {
    try {
      // ถ้าอยู่ในโหมด Dev Mode ให้ลบเฉพาะใน state
      if (isDevMode) {
        setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId))
        toast({
          title: "ลบเพลงสำเร็จ (Dev Mode)",
          description: "ลบเพลงเรียบร้อยแล้ว (ข้อมูลจำลอง)",
        })
        return
      }

      const { error } = await supabase.from("songs").delete().eq("id", songId)

      if (error) throw error

      setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId))

      toast({
        title: "ลบเพลงสำเร็จ",
        description: "ลบเพลงเรียบร้อยแล้ว",
      })
    } catch (error) {
      console.error("Error deleting song:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบเพลงได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    }
  }

  // Function to toggle chord visibility
  const handleToggleChords = async (songId: string, showChords: boolean) => {
    try {
      // ถ้าอยู่ในโหมด Dev Mode ให้อัปเดตเฉพาะใน state
      if (isDevMode) {
        setSongs((prevSongs) =>
          prevSongs.map((song) => (song.id === songId ? { ...song, show_chords: showChords } : song)),
        )
        return
      }

      const { error } = await supabase.from("songs").update({ show_chords: showChords }).eq("id", songId)

      if (error) throw error

      setSongs((prevSongs) =>
        prevSongs.map((song) => (song.id === songId ? { ...song, show_chords: showChords } : song)),
      )
    } catch (error) {
      console.error("Error toggling chords:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตการแสดง/ซ่อนคอร์ดได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    }
  }

  // Function to toggle favorite
  const handleToggleFavorite = async (songId: string) => {
    try {
      // ถ้าอยู่ในโหมด Dev Mode ให้อัปเดตเฉพาะใน state
      if (isDevMode) {
        setSongs((prevSongs) =>
          prevSongs.map((song) => (song.id === songId ? { ...song, is_favorite: !song.is_favorite } : song)),
        )
        toast({
          title: (song) => (song.is_favorite ? "ลบออกจากเพลงโปรดแล้ว (Dev Mode)" : "เพิ่มเข้าเพลงโปรดแล้ว (Dev Mode)"),
          description: "อัปเดตเพลงโปรดเรียบร้อยแล้ว (ข้อมูลจำลอง)",
        })
        return
      }

      // ดึงข้อมูลผู้ใช้ปัจจุบัน
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "กรุณาเข้าสู่ระบบ",
          description: "กรุณาเข้าสู่ระบบก่อนเพิ่ม/ลบเพลงโปรด",
          variant: "destructive",
        })
        return
      }

      // ตรวจสอบว่าเพลงนี้เป็นเพลงโปรดของผู้ใช้หรือไม่
      const { data: favorite } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single()

      if (favorite) {
        // ถ้าเป็นเพลงโปรดอยู่แล้ว ให้ลบออก
        const { error } = await supabase.from("favorites").delete().eq("id", favorite.id)

        if (error) throw error

        setSongs((prevSongs) => prevSongs.map((song) => (song.id === songId ? { ...song, is_favorite: false } : song)))

        toast({
          title: "ลบออกจากเพลงโปรดแล้ว",
          description: "ลบเพลงออกจากรายการเพลงโปรดเรียบร้อยแล้ว",
        })
      } else {
        // ถ้ายังไม่เป็นเพลงโปรด ให้เพิ่มเข้าไป
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          song_id: songId,
        })

        if (error) throw error

        setSongs((prevSongs) => prevSongs.map((song) => (song.id === songId ? { ...song, is_favorite: true } : song)))

        toast({
          title: "เพิ่มเข้าเพลงโปรดแล้ว",
          description: "เพิ่มเพลงเข้ารายการเพลงโปรดเรียบร้อยแล้ว",
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่ม/ลบเพลงโปรดได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    }
  }

  // สร้างรายการคำแนะนำจากชื่อเพลง, ศิลปิน และเนื้อเพลง
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    // รวมชื่อเพลงและศิลปินทั้งหมด
    const allTitles = songs.map((song) => song.title)
    const allArtists = songs.map((song) => song.artist)

    // ดึงคำสำคัญจากเนื้อเพลง (เฉพาะคำที่มีความยาวมากกว่า 3 ตัวอักษร)
    const lyricsKeywords = songs.flatMap((song) => {
      // แยกเนื้อเพลงเป็นคำ และกรองคอร์ดออก
      const words = song.lyrics
        .replace(/\[.*?\]/g, "") // ลบคอร์ดในวงเล็บเหลี่ยม
        .split(/\s+/) // แยกตามช่องว่าง
        .filter((word) => word.length > 3) // กรองเฉพาะคำที่มีความยาวมากกว่า 3 ตัวอักษร
        .map((word) => word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")) // ลบเครื่องหมายวรรคตอน

      return [...new Set(words)] // ลบคำซ้ำ
    })

    const allStrings = [...new Set([...allTitles, ...allArtists, ...lyricsKeywords])]

    // ค้นหาคำที่คล้ายกับคำค้นหา
    const similarStrings = allStrings.filter((str) => str.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5) // แสดงเฉพาะ 5 คำแนะนำแรก

    setSuggestions(similarStrings)
  }, [searchQuery, songs])

  // Filter songs based on search query, selected category, selected language, and selected tag
  useEffect(() => {
    let result = songs

    if (searchQuery) {
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.lyrics.toLowerCase().includes(searchQuery.toLowerCase()), // เพิ่มการค้นหาจากเนื้อเพลง
      )
    }

    // กรองตามหมวดหมู่ (แบบเลือกได้หลายรายการ)
    if (selectedCategories.length > 0) {
      result = result.filter((song) => selectedCategories.includes(song.category))
    } else if (selectedCategory !== "all") {
      // ใช้ตัวกรองเดิมถ้าไม่ได้เลือกหมวดหมู่ในการค้นหาขั้นสูง
      result = result.filter((song) => song.category === selectedCategory)
    }

    // กรองตามภาษา (แบบเลือกได้หลายรายการ)
    if (selectedLanguages.length > 0) {
      result = result.filter((song) => selectedLanguages.includes(song.language))
    } else if (selectedLanguage !== "all") {
      // ใช้ตัวกรองเดิมถ้าไม่ได้เลือกภาษาในการค้นหาขั้นสูง
      result = result.filter((song) => song.language === selectedLanguage)
    }

    // กรองตาม tag (แบบเลือกได้หลายรายการ)
    if (selectedTags.length > 0) {
      result = result.filter((song) => song.tags && song.tags.some((tag) => selectedTags.includes(tag)))
    } else if (selectedTag !== "all") {
      // ใช้ตัวกรองเดิมถ้าไม่ได้เลือก tag ในการค้นหาขั้นสูง
      result = result.filter((song) => song.tags && song.tags.includes(selectedTag as SongTag))
    }

    // เรียงลำดับเพลงตามตัวเลือกการเรียงลำดับ
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA // เรียงจากใหม่ไปเก่า
        case "oldest":
          const dateC = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateD = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateC - dateD // เรียงจากเก่าไปใหม่
        case "titleAsc":
          return a.title.localeCompare(b.title) // เรียงตามชื่อเพลง A-Z
        case "titleDesc":
          return b.title.localeCompare(a.title) // เรียงตามชื่อเพลง Z-A
        case "artistAsc":
          return a.artist.localeCompare(b.artist) // เรียงตามชื่อศิลปิน A-Z
        case "artistDesc":
          return b.artist.localeCompare(a.artist) // เรียงตามชื่อศิลปิน Z-A
        default:
          const dateE = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateF = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateF - dateE // เรียงจากใหม่ไปเก่า (ค่าเริ่มต้น)
      }
    })

    setFilteredSongs(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [
    searchQuery,
    selectedCategory,
    selectedLanguage,
    selectedTag,
    songs,
    selectedCategories,
    selectedLanguages,
    selectedTags,
    sortOption,
  ])

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    setPaginatedSongs(filteredSongs.slice(startIndex, endIndex))
  }, [filteredSongs, currentPage])

  // Calculate total pages
  const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []

    if (totalPages <= 7) {
      // If there are 7 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Add ellipsis if current page is more than 3
      if (currentPage > 3) {
        pageNumbers.push("ellipsis")
      }

      // Add page numbers around current page
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if current page is less than totalPages - 2
      if (currentPage < totalPages - 2) {
        pageNumbers.push("ellipsis")
      }

      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  // จัดการการเลือกคำแนะนำ
  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
  }

  // ฟังก์ชันสำหรับรีเซ็ตตัวกรองทั้งหมด
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedLanguage("all")
    setSelectedTag("all")
    setSelectedCategories([])
    setSelectedLanguages([])
    setSelectedTags([])
    setSortOption("newest")
  }

  // ตัวเลือกสำหรับการเรียงลำดับ
  const sortOptions = [
    { label: "ล่าสุด", value: "newest", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { label: "เก่าสุด", value: "oldest", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { label: "ชื่อเพลง A-Z", value: "titleAsc", icon: <ArrowDownAZ className="h-4 w-4 mr-2" /> },
    { label: "ชื่อเพลง Z-A", value: "titleDesc", icon: <ArrowUpZA className="h-4 w-4 mr-2" /> },
    { label: "ศิลปิน A-Z", value: "artistAsc", icon: <ArrowDownAZ className="h-4 w-4 mr-2" /> },
    { label: "ศิลปิน Z-A", value: "artistDesc", icon: <ArrowUpZA className="h-4 w-4 mr-2" /> },
  ]

  // ตัวเลือกสำหรับหมวดหมู่
  const categoryOptions = [
    { label: "สรรเสริญ", value: "praise" },
    { label: "นมัสการ", value: "worship" },
    { label: "บทเพลงเปิด", value: "opening" },
  ]

  // ตัวเลือกสำหรับภาษา
  const languageOptions = [
    { label: "ภาษาไทย", value: "thai" },
    { label: "ภาษาอังกฤษ", value: "english" },
    { label: "ภาษาอื่นๆ", value: "other" },
  ]

  // ตัวเลือกสำหรับ tags
  const tagOptions = [
    { label: "ทั้งหมด", value: "all" },
    { label: "เพลงช้า", value: "slow", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
    { label: "เพลงเร็ว", value: "fast", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
    {
      label: "เพลงปานกลาง",
      value: "medium",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    { label: "อะคูสติก", value: "acoustic", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" },
    {
      label: "อิเล็กทรอนิกส์",
      value: "electronic",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      label: "เพลงนมัสการดั้งเดิม",
      value: "hymn",
      color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    },
    {
      label: "เพลงนมัสการร่วมสมัย",
      value: "contemporary",
      color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    },
    {
      label: "เพลงสำหรับเด็ก",
      value: "kids",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    },
    { label: "อื่นๆ", value: "other", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
  ]

  // ตัวเลือกสำหรับ MultiSelect
  const multiSelectCategoryOptions = categoryOptions.map((cat) => ({ label: cat.label, value: cat.value }))
  const multiSelectLanguageOptions = languageOptions.map((lang) => ({ label: lang.label, value: lang.value }))
  const multiSelectTagOptions = tagOptions.slice(1).map((tag) => ({
    label: tag.label,
    value: tag.value,
    color: tag.color,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-2/3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="ค้นหาเพลงจากชื่อ, ศิลปิน หรือเนื้อเพลง"
              className="pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(e.target.value.length >= 2)
              }}
              onFocus={() => setShowSuggestions(searchQuery.length >= 2)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </div>
          <SearchSuggestions
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
            isVisible={showSuggestions}
            className="z-10"
          />
        </div>
        <div className="flex gap-2">
          <DevModeToggle isDevMode={isDevMode} onToggle={setIsDevMode} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
            className="text-primary"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            ค้นหาขั้นสูง
          </Button>
          <div className="w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="หมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AddSongButton className="hidden md:flex" onAddSong={addSong} />
        </div>
      </div>

      {isDevMode && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 mb-4">
          <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">
            โหมดนักพัฒนา: กำลังใช้ข้อมูลจำลอง (Mock Data) จำนวน {mockSongs.length} เพลง
          </p>
        </div>
      )}

      <Collapsible open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen} className="space-y-4">
        <CollapsibleContent className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-primary">ค้นหาขั้นสูง</h3>
            <Button variant="outline" size="sm" onClick={resetFilters} className="text-primary">
              <X className="h-4 w-4 mr-2" />
              รีเซ็ตตัวกรอง
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">หมวดหมู่ (เลือกได้หลายรายการ)</label>
              <MultiSelect
                options={multiSelectCategoryOptions}
                selected={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="เลือกหมวดหมู่..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">ภาษา (เลือกได้หลายรายการ)</label>
              <MultiSelect
                options={multiSelectLanguageOptions}
                selected={selectedLanguages}
                onChange={setSelectedLanguages}
                placeholder="เลือกภาษา..."
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-primary">แท็ก (เลือกได้หลายรายการ)</label>
            <MultiSelect
              options={multiSelectTagOptions}
              selected={selectedTags}
              onChange={setSelectedTags}
              placeholder="เลือกแท็ก..."
            />
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-primary">เรียงลำดับตาม</label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกการเรียงลำดับ" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">พบ {filteredSongs.length} เพลงที่ตรงกับเงื่อนไข</p>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsAdvancedSearchOpen(false)}
                className="bg-primary text-primary-foreground"
              >
                ใช้ตัวกรอง
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex flex-wrap gap-2 mb-4">
        {tagOptions.map((tag) => (
          <Badge
            key={tag.value}
            variant={selectedTag === tag.value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTag(tag.value)}
          >
            {tag.label}
          </Badge>
        ))}
      </div>

      <div className="md:hidden mb-4">
        <AddSongButton className="w-full" onAddSong={addSong} />
      </div>

      {isLoading ? (
        <SongListSkeleton />
      ) : paginatedSongs.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                searchQuery={searchQuery}
                onUpdateSong={updateSong}
                onDeleteSong={deleteSong}
                onToggleChords={handleToggleChords}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber, index) =>
                  pageNumber === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => setCurrentPage(pageNumber as number)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow-sm border border-border">
          <p className="text-muted-foreground mb-2">
            ไม่พบเพลงที่ตรงกับคำค้นหา &quot;{searchQuery}&quot; ในชื่อเพลง, ศิลปิน หรือเนื้อเพลง
          </p>
          {suggestions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">คุณอาจกำลังค้นหา:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSearchQuery(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
