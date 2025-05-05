"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Edit2, Calendar, Globe, Tag, Music } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { EditSongForm } from "@/components/edit-song-form"
import { DeleteSongDialog } from "@/components/delete-song-dialog"
import { ChordToggle } from "@/components/chord-toggle"
import { FontSizeAdjuster } from "@/components/shadcn/font-size-adjuster"
import { formatLyricsWithFormattedChords, getFontSizeClass } from "@/utils/format-lyrics"
import { formatDate } from "@/utils/format-date"
import { transposeSong } from "@/utils/chord-transposer"
import type { Song, SongCategory, SongLanguage, SongTag } from "@/types/song"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import React from "react"

// เพิ่มการนำเข้า getSongKeys และ getSongPrimaryKey
import { getSongKeys, getSongPrimaryKey, type SongKey } from "@/lib/services/song-key-service"

interface SongCardProps {
    song: Song
    searchQuery: string
    onUpdateSong?: (song: Song) => void
    onDeleteSong?: (songId: string) => void
    onToggleChords?: (songId: string, showChords: boolean) => void
}

const SongCard = ({
    song,
    searchQuery,
    onUpdateSong,
    onDeleteSong,
    onToggleChords,
}: SongCardProps): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false)
    const [fontSize, setFontSize] = useState<string>("medium")
    const [currentKey, setCurrentKey] = useState<string>(song.key || "C")
    const { isAdmin } = useAuth()
    const showChords = song.show_chords ?? true // ค่าเริ่มต้นคือแสดงคอร์ด
    const originalKey = song.key || "C" // คีย์เดิมของเพลง

    // เพิ่ม state สำหรับเก็บข้อมูลคีย์
    const [songKeys, setSongKeys] = useState<SongKey[]>([])
    const [primaryKey, setPrimaryKey] = useState<SongKey | null>(null)
    const [isLoadingKeys, setIsLoadingKeys] = useState<boolean>(false)

    const toggleExpand = (): void => {
        setIsExpanded(!isExpanded)
    }

    const handleToggleChords = (): void => {
        if (onToggleChords) {
            onToggleChords(song.id, !showChords)
        }
    }

    const handleFontSizeChange = (size: string): void => {
        setFontSize(size)
    }

    const handleKeyChange = (newKey: string): void => {
        setCurrentKey(newKey)
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
            praise: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800",
            worship:
                "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800",
            opening:
                "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800",
        }
        return (
            colors[category as SongCategory] ||
            "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        )
    }

    const getLanguageColor = (language?: SongLanguage): string => {
        if (!language)
            return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"

        const colors: Record<SongLanguage, string> = {
            thai: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            english: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
            other: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
        }
        return (
            colors[language] ||
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
        )
    }

    const getTagColor = (tag: SongTag): string => {
        const colors: Record<SongTag, string> = {
            slow: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            fast: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            medium: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            acoustic: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
            electronic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
            hymn: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
            contemporary: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
            kids: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
            other: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        }
        return colors[tag] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
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
                    )
                )}
            </>
        )
    }

    // ฟังก์ชันสำหรับไฮไลท์คำที่ค้นหาในเนื้อเพลงที่มีคอร์ด
    const highlightLyrics = (): JSX.Element => {
        // เปลี่ยนคีย์เพลงถ้าจำเป็น
        const transposedLyrics =
            currentKey !== originalKey
                ? transposeSong(song.lyrics, originalKey, currentKey)
                : song.lyrics

        if (!searchQuery || !transposedLyrics.toLowerCase().includes(searchQuery.toLowerCase())) {
            // ถ้าไม่มีคำค้นหาหรือไม่พบคำค้นหาในเนื้อเพลง ให้แสดงเนื้อเพลงปกติ
            return formatLyricsWithFormattedChords(
                transposedLyrics,
                showChords,
                fontSize
            ) as JSX.Element
        }

        // ถ้าซ่อนคอร์ด ให้ลบคอร์ดออกก่อนแล้วค่อยไฮไลท์
        if (!showChords) {
            const lyricsWithoutChords = transposedLyrics.replace(/\[.*?\]/g, "")
            const lines = lyricsWithoutChords.split("\n")

            return (
                <div
                    className={`font-sarabun text-gray-700 dark:text-gray-300 ${getFontSizeClass(fontSize)} leading-relaxed`}
                >
                    {lines.map((line, lineIndex) => {
                        const parts = line.split(new RegExp(`(${searchQuery})`, "gi"))

                        return (
                            <div key={lineIndex} className="mb-1">
                                {parts.map((part, partIndex) =>
                                    part.toLowerCase() === searchQuery.toLowerCase() ? (
                                        <span
                                            key={partIndex}
                                            className="bg-yellow-200 dark:bg-yellow-900 font-medium"
                                        >
                                            {part}
                                        </span>
                                    ) : (
                                        <span key={partIndex}>{part}</span>
                                    )
                                )}
                            </div>
                        )
                    })}
                </div>
            )
        }

        // ถ้าแสดงคอร์ด ต้องแยกคอร์ดออกจากเนื้อเพลงก่อนไฮไลท์
        const lines = transposedLyrics.split("\n")

        return (
            <div
                className={`font-sarabun text-gray-700 dark:text-gray-300 ${getFontSizeClass(fontSize)} leading-relaxed`}
            >
                {lines.map((line, lineIndex) => {
                    const parts = line.split(/(\[.*?\])/g)

                    return (
                        <div key={lineIndex} className="mb-1">
                            {parts.map((part, partIndex) => {
                                if (part.startsWith("[") && part.endsWith("]")) {
                                    // เป็นคอร์ด - เพิ่มการเน้นคอร์ด
                                    return (
                                        <span
                                            key={partIndex}
                                            className="text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-0.5 rounded"
                                        >
                                            {part}
                                        </span>
                                    )
                                }

                                // เป็นเนื้อเพลง ให้ไฮไลท์คำที่ค้นหา
                                const textParts = part.split(new RegExp(`(${searchQuery})`, "gi"))
                                return (
                                    <React.Fragment key={partIndex}>
                                        {textParts.map((textPart, textIndex) =>
                                            textPart.toLowerCase() === searchQuery.toLowerCase() ? (
                                                <span
                                                    key={textIndex}
                                                    className="bg-yellow-200 dark:bg-yellow-900 font-medium"
                                                >
                                                    {textPart}
                                                </span>
                                            ) : (
                                                <span key={textIndex}>{textPart}</span>
                                            )
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }

    const handleSongUpdate = (updatedSong: Song): void => {
        if (onUpdateSong) {
            onUpdateSong(updatedSong)
        }
    }

    const handleSongDelete = (songId: string): void => {
        if (onDeleteSong) {
            onDeleteSong(songId)
        }
    }

    const formattedDate = song.created_at ? formatDate(song.created_at) : "ไม่ระบุวันที่"

    // เพิ่มฟังก์ชันสำหรับโหลดข้อมูลคีย์
    const loadSongKeys = async () => {
        if (!isExpanded) return

        try {
            setIsLoadingKeys(true)
            const [keysData, primaryKeyData] = await Promise.all([
                getSongKeys(song.id),
                getSongPrimaryKey(song.id),
            ])

            setSongKeys(keysData)
            setPrimaryKey(primaryKeyData)
        } catch (error) {
            console.error("Error loading song keys:", error)
        } finally {
            setIsLoadingKeys(false)
        }
    }

    // เรียกใช้ฟังก์ชัน loadSongKeys เมื่อ isExpanded เปลี่ยนแปลง
    useEffect(() => {
        if (isExpanded) {
            loadSongKeys()
        }
    }, [isExpanded, song.id])

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-blue-50 dark:border-blue-900 transition-all hover:shadow-md">
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300">
                                {highlightText(song.title)}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {highlightText(song.artist)}
                            </p>

                            {/* เพิ่ม preview เนื้อเพลง */}
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-sarabun line-clamp-2">
                                {highlightText(getLyricPreview(song.lyrics))}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{formattedDate}</span>
                                </div>
                                {song.language && (
                                    <div className="flex items-center text-xs">
                                        <Badge
                                            className={cn(
                                                "font-normal text-xs py-0 px-1.5",
                                                getLanguageColor(song.language)
                                            )}
                                        >
                                            <Globe className="h-2.5 w-2.5 mr-1" />
                                            {getLanguageLabel(song.language)}
                                        </Badge>
                                    </div>
                                )}

                                {/* แสดง tags */}
                                {song.tags && song.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {song.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                className={cn(
                                                    "font-normal text-xs py-0 px-1.5",
                                                    getTagColor(tag)
                                                )}
                                            >
                                                <Tag className="h-2.5 w-2.5 mr-1" />
                                                {getTagLabel(tag)}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={cn("font-normal", getCategoryColor(song.category))}>
                                {getCategoryLabel(song.category)}
                            </Badge>

                            {isAdmin && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-full text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                                        onClick={() => setIsEditFormOpen(true)}
                                        aria-label="แก้ไขเพลง"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>

                                    <DeleteSongDialog song={song} onDeleteSong={handleSongDelete} />
                                </>
                            )}

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full text-gray-500 dark:text-gray-400"
                                onClick={toggleExpand}
                                aria-label={isExpanded ? "ซ่อนเนื้อเพลง" : "แสดงเนื้อเพลง"}
                            >
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="px-4 pb-4 pt-0">
                        <div className="border-t border-blue-50 dark:border-blue-900 pt-3 mt-1">
                            {/* แสดงคีย์ของเพลง */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <Music className="h-3 w-3 mr-1" />
                                    คีย์:
                                </span>

                                {isLoadingKeys ? (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        กำลังโหลด...
                                    </span>
                                ) : songKeys.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {songKeys.map((key) => (
                                            <Badge
                                                key={key.id}
                                                className={cn(
                                                    primaryKey?.id === key.id
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                                )}
                                            >
                                                {key.key_name}
                                                {primaryKey?.id === key.id && " (หลัก)"}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        ไม่มีคีย์ที่กำหนด
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <FontSizeAdjuster onSizeChange={handleFontSizeChange} />
                                    {/* เอาส่วนของ KeySelector ออก เพราะเราใช้ SongKeyManager แทน */}
                                </div>
                                <ChordToggle
                                    showChords={showChords}
                                    onToggle={handleToggleChords}
                                />
                            </div>
                            {highlightLyrics()}
                        </div>
                    </div>
                )}
            </div>

            {isAdmin && (
                <EditSongForm
                    song={song}
                    isOpen={isEditFormOpen}
                    onClose={() => setIsEditFormOpen(false)}
                    onUpdateSong={handleSongUpdate}
                />
            )}
        </>
    )
}

export default SongCard
