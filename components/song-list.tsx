"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import SongCard from "@/components/song-card"
import { AddSongButton } from "@/components/add-song-button"
import { SearchSuggestions } from "@/components/search-suggestions"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcn/pagination"
import type { Song, SongLanguage } from "@/types/song"
import { useAuth } from "@/hooks/use-auth"
import { findSimilarStrings } from "@/utils/string-similarity"

const ITEMS_PER_PAGE = 10 // จำนวนเพลงต่อหน้า

const SongList = (): JSX.Element => {
  // เพิ่มภาษาให้กับข้อมูลตัวอย่าง
  const initialSongs = mockSongs.map((song) => ({
    ...song,
    showChords: true,
    language: song.language || ((song.id % 3 === 0 ? "english" : "thai") as SongLanguage), // สุ่มภาษาถ้าไม่มีการกำหนด
    createdAt: song.createdAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // สุ่มวันที่ย้อนหลังไม่เกิน 30 วัน
  }))

  const [songs, setSongs] = useState<Song[]>(initialSongs)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all") // เพิ่มตัวกรองภาษา
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songs)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [paginatedSongs, setPaginatedSongs] = useState<Song[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { isAdmin } = useAuth()

  // Function to update a song
  const updateSong = (updatedSong: Song): void => {
    setSongs((prevSongs) => prevSongs.map((song) => (song.id === updatedSong.id ? updatedSong : song)))
  }

  // Function to add a new song
  const addSong = (newSong: Song): void => {
    setSongs((prevSongs) => [newSong, ...prevSongs]) // เพิ่มเพลงใหม่ไว้ที่ตำแหน่งแรก
  }

  // Function to delete a song
  const deleteSong = (songId: string): void => {
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId))
  }

  // Function to toggle chord visibility
  const toggleChords = (songId: string, showChords: boolean): void => {
    setSongs((prevSongs) => prevSongs.map((song) => (song.id === songId ? { ...song, showChords } : song)))
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
    const similarStrings = findSimilarStrings(searchQuery, allStrings, 0.3)
    setSuggestions(similarStrings.slice(0, 5)) // แสดงเฉพาะ 5 คำแนะนำแรก
  }, [searchQuery, songs])

  // Filter songs based on search query, selected category, and selected language
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

    if (selectedCategory !== "all") {
      result = result.filter((song) => song.category === selectedCategory)
    }

    // กรองตามภาษา
    if (selectedLanguage !== "all") {
      result = result.filter((song) => song.language === selectedLanguage)
    }

    // เรียงลำดับเพลงตามวันที่เพิ่ม (เพลงล่าสุดอยู่บนสุด)
    result = [...result].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA // เรียงจากใหม่ไปเก่า
    })

    setFilteredSongs(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, selectedCategory, selectedLanguage, songs])

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    setPaginatedSongs(filteredSongs.slice(startIndex, endIndex))
  }, [filteredSongs, currentPage])

  // Calculate total pages
  const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE)

  // Generate page numbers for pagination
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pageNumbers: (number | "ellipsis")[] = []

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
  const handleSelectSuggestion = (suggestion: string): void => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }

  // จัดการการคลิกนอก dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={searchInputRef}
            placeholder="ค้นหาเพลงจากชื่อ, ศิลปิน หรือเนื้อเพลง..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700"
          />
          <SearchSuggestions
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
            isVisible={showSuggestions && suggestions.length > 0}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
              <SelectValue placeholder="หมวดหมู่" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
              <SelectItem value="all" className="text-gray-900 dark:text-gray-100">
                ทั้งหมด
              </SelectItem>
              <SelectItem value="praise" className="text-gray-900 dark:text-gray-100">
                สรรเสริญ
              </SelectItem>
              <SelectItem value="worship" className="text-gray-900 dark:text-gray-100">
                นมัสการ
              </SelectItem>
              <SelectItem value="opening" className="text-gray-900 dark:text-gray-100">
                บทเพลงเปิด
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
              <SelectValue placeholder="ภาษา" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
              <SelectItem value="all" className="text-gray-900 dark:text-gray-100">
                ทุกภาษา
              </SelectItem>
              <SelectItem value="thai" className="text-gray-900 dark:text-gray-100">
                ภาษาไทย
              </SelectItem>
              <SelectItem value="english" className="text-gray-900 dark:text-gray-100">
                ภาษาอังกฤษ
              </SelectItem>
              <SelectItem value="other" className="text-gray-900 dark:text-gray-100">
                ภาษาอื่นๆ
              </SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <AddSongButton
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
              onAddSong={addSong}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {paginatedSongs.length > 0 ? (
          <>
            {paginatedSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                searchQuery={searchQuery}
                onUpdateSong={updateSong}
                onDeleteSong={deleteSong}
                onToggleChords={toggleChords}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((pageNumber, index) => (
                      <PaginationItem key={index}>
                        {pageNumber === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={pageNumber === currentPage}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              ไม่พบเพลงที่ตรงกับคำค้นหา "{searchQuery}" ในชื่อเพลง, ศิลปิน หรือเนื้อเพลง
            </p>
            {suggestions.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-400 mb-2">คุณอาจกำลังค้นหา:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Mock data for demonstration - เพิ่มเป็น 20 เพลง
const mockSongs: Song[] = [
  {
    id: "1",
    title: "พระเจ้าทรงเป็นความรัก",
    artist: "คณะนักร้องประสานเสียง",
    category: "praise",
    language: "thai",
    lyrics:
      "[G]พระเจ้าทรงเป็นความ[D]รัก\n[C]พระองค์ทรงรัก[G]เรา\n[G]พระเจ้าทรงเป็นความ[D]รัก\n[C]พระองค์ทรงรัก[G]เรา\n\n[Em]พระองค์ทรงส่งพระ[D]บุตร\n[C]มาสิ้นพระชนม์เพื่อ[G]เรา\n[Em]เพื่อเราจะได้มี[D]ชีวิต\n[C]ชีวิตนิรัน[G]ดร์",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 วันที่แล้ว
  },
  {
    id: "2",
    title: "พระคุณพระเจ้า",
    artist: "วงศ์วานวิหาร",
    category: "worship",
    language: "thai",
    lyrics:
      "[G]พระคุณพระเจ้านั้นแสน[D]ชื่นใจ\n[C]ช่วยคนบาปอย่าง[G]ฉันได้รอด\n[Em]ฉันหลงทางพระองค์[D]ตามหา\n[C]ฉันตาบอดแต่เดี๋ยวนี้[G]เห็นแล้ว",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 วันที่แล้ว
  },
  {
    id: "3",
    title: "ขอบคุณพระเจ้า",
    artist: "คริสตจักรสัมพันธ์",
    category: "opening",
    language: "thai",
    lyrics:
      "[C]ขอบคุณพระเจ้า สำหรับความ[G]รักของพระองค์\n[F]ขอบคุณพระเจ้า สำหรับพระ[C]พรทุกอย่าง\n[C]ขอบคุณพระเจ้า สำหรับการ[G]ทรงนำ\n[F]ขอบคุณพระเจ้า สำหรับชีวิต[C]ใหม่",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 วันที่แล้ว
  },
  // เพิ่มวันที่ให้กับเพลงที่เหลือโดยอัตโนมัติในโค้ดด้านบน
  {
    id: "4",
    title: "สรรเสริญพระเจ้า",
    artist: "คณะนักร้องรวมใจ",
    category: "praise",
    language: "thai",
    lyrics:
      "[D]สรรเสริญ สรรเสริญ สรรเสริญพระ[A]เจ้า\n[G]สรรเสริญ สรรเสริญ พระผู้ช่วยให้[D]รอด\n[Bm]พระองค์ทรงยิ่งใหญ่ พระองค์ทรง[A]สมควร\n[G]ได้รับคำสรรเสริญ จากปวงชนทั้ง[D]หลาย",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    title: "พระเยซูรักฉัน",
    artist: "คริสตจักรพระพร",
    category: "worship",
    language: "thai",
    lyrics:
      "[G]พระเยซูรักฉัน พระ[D]คัมภีร์สอนไว้\n[C]เด็กเล็กๆ เป็นของพระ[G]องค์\n[Em]เด็กอ่อนแอ พระองค์ทรง[D]ฤทธิ์\n[C]พระองค์ทรงสถิตใน[G]สวรรค์",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    title: "Amazing Grace",
    artist: "John Newton",
    category: "worship",
    language: "english",
    lyrics:
      "[D]Amazing [G]grace! How [D]sweet the [A]sound\n[D]That saved a [G]wretch like [A]me!\n[D]I once was [G]lost, but [D]now am [A]found;\n[D]Was blind, but [G]now I [A]see.[D]",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    title: "How Great Thou Art",
    artist: "Stuart K. Hine",
    category: "praise",
    language: "english",
    lyrics:
      "[G]O Lord my [C]God, when I in [G]awesome [D]wonder\n[G]Consider [C]all the [G]worlds Thy hands have [D]made\n[G]I see the [C]stars, I hear the [G]rolling [D]thunder\n[G]Thy power [D]throughout the [G]universe [C]displayed\n\n[G]Then sings my [D]soul, my [G]Savior God, to [C]Thee\n[G]How great Thou [D]art, how [G]great Thou [C]art\n[G]Then sings my [D]soul, my [G]Savior God, to [C]Thee\n[G]How great Thou [D]art, how [G]great Thou [C]art[G]",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    title: "What A Friend We Have In Jesus",
    artist: "Joseph M. Scriven",
    category: "opening",
    language: "english",
    lyrics:
      "[C]What a friend we [F]have in [C]Jesus,\n[C]All our sins and [G7]griefs to [C]bear!\n[C]What a privilege to [F]carry\n[C]Every[G7]thing to God in [C]prayer!",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "9",
    title: "พระเยซูเป็นพระผู้ช่วย",
    artist: "คณะนักร้องพระกิตติคุณ",
    category: "praise",
    language: "thai",
    lyrics: "[D]พระเยซูเป็นพระผู้[A]ช่วย\n[G]ทรงช่วยฉันให้[D]รอด\n[D]พระองค์ทรงสละ[A]ชีวิต\n[G]เพื่อไถ่บาปของ[D]ฉัน",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "10",
    title: "พระเจ้าทรงสถิตกับเรา",
    artist: "คริสตจักรพระพร",
    category: "worship",
    language: "thai",
    lyrics: "[G]พระเจ้าทรงสถิตกับ[D]เรา\n[C]ทุกเวลาทุก[G]นาที\n[Em]ไม่ว่าเราจะอยู่[D]ที่ไหน\n[C]พระองค์ทรงอยู่[G]ที่นั่น",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "11",
    title: "This Is My Father's World",
    artist: "Maltbie D. Babcock",
    category: "praise",
    language: "english",
    lyrics:
      "[G]This is my [C]Father's [G]world,\nAnd [G]to my [D]listening [G]ears\n[G]All [G]nature [C]sings, and [G]round me rings\nThe [D]music of the [G]spheres.",
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "12",
    title: "พระเยซูทรงชนะ",
    artist: "คริสตจักรชัยชนะ",
    category: "worship",
    language: "thai",
    lyrics: "[G]พระเยซูทรงชนะ[D]แล้ว\n[C]ชนะความตายและ[G]บาป\n[Em]พระองค์ทรงฟื้นคืน[D]พระชนม์\n[C]และประทับบนบัลลังก์[G]สวรรค์",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "13",
    title: "Holy, Holy, Holy",
    artist: "Reginald Heber",
    category: "opening",
    language: "english",
    lyrics:
      "[D]Holy, [A]holy, [D]holy! [G]Lord God Al[D]mighty!\n[A]Early in the [D]morning our [A]song shall [D]rise to Thee;\n[D]Holy, [A]holy, [D]holy, [G]merciful and [D]mighty!\n[G]God in three [D]Persons, [A]blessed [D]Trinity!",
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "14",
    title: "พระเจ้าทรงเป็นผู้เลี้ยง",
    artist: "คณะนักร้องรวมใจ",
    category: "praise",
    language: "thai",
    lyrics: "[D]พระเจ้าทรงเป็นผู้[A]เลี้ยง\n[G]ข้าพเจ้าจะไม่[D]ขัดสน\n[D]พระองค์ทรงให้ข้าพเจ้า[A]นอนลง\n[G]ที่ทุ่งหญ้าเขียว[D]สด",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "15",
    title: "Great Is Thy Faithfulness",
    artist: "Thomas O. Chisholm",
    category: "worship",
    language: "english",
    lyrics:
      "[D]Great is Thy [G]faithful[D]ness, O God my [A]Father;\n[D]There is no [G]shadow of [D]turning with [A]Thee;\n[D]Thou changest [G]not, Thy com[D]passions, they [G]fail [D]not;\n[G]As Thou hast [D]been, Thou for[A]ever will [D]be.",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "16",
    title: "พระเจ้าทรงสร้าง",
    artist: "คณะนักร้องไทยนมัสการ",
    category: "opening",
    language: "thai",
    lyrics: "[C]พระเจ้าทรงสร้างฟ้า[G]สวรรค์\n[F]และแผ่นดิน[C]โลก\n[C]ทรงสร้างทุกสิ่งด้วย[G]พระวจนะ\n[F]และลมพระโอษฐ์ของ[C]พระองค์",
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "17",
    title: "It Is Well With My Soul",
    artist: "Horatio G. Spafford",
    category: "praise",
    language: "english",
    lyrics:
      "[D]When peace, like a [G]river, at[D]tendeth my [G]way,\n[D]When sorrows like [G]sea billows [A]roll;\n[D]Whatever my [G]lot, Thou hast [D]taught me to [G]say,\n[D]It is [A]well, it is [D]well with my [G]soul.[D]",
    createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "18",
    title: "พระเจ้าทรงเป็นความหวัง",
    artist: "คณะนักร้องศิโยน",
    category: "worship",
    language: "thai",
    lyrics: "[G]พระเจ้าทรงเป็นความ[D]หวัง\n[C]ของข้าพเจ้าเสมอ[G]มา\n[Em]ในยามทุกข์และยาม[D]สุข\n[C]พระองค์ทรงอยู่[G]เคียงข้าง",
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "19",
    title: "How Great Is Our God",
    artist: "Chris Tomlin",
    category: "opening",
    language: "english",
    lyrics:
      "[G]The splendor of the [Em]King, [C]clothed in majesty\n[G]Let all the earth [Em]rejoice, [C]all the earth rejoice\n[G]He wraps Himself in [Em]light, and [C]darkness tries to hide\n[G]And trembles at His [Em]voice, [C]trembles at His voice",
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "20",
    title: "พระเจ้าทรงเป็นความรอด",
    artist: "คณะนักร้องรวมใจ",
    category: "praise",
    language: "thai",
    lyrics: "[D]พระเจ้าทรงเป็นความ[A]รอด\n[G]และเป็นกำลังของ[D]ข้าพเจ้า\n[D]พระองค์ทรงเป็นที่[A]พึ่ง\n[G]ในยามทุกข์[D]ยาก",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Export the component as default
export default SongList
