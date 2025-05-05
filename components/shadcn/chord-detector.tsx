"use client"

import { useState, useEffect } from "react"
import { Music, Check, AlertCircle, Plus } from "lucide-react"
import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { cn } from "@/lib/utils"
import { getAllKeys } from "@/utils/chord-transposer"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/shadcn/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"

interface ChordDetectorProps {
    lyrics: string
    currentKey: string
    onKeyChange: (key: string) => void
    className?: string
}

export function ChordDetector({
    lyrics,
    currentKey,
    onKeyChange,
    className,
}: ChordDetectorProps): JSX.Element {
    const [detectedChords, setDetectedChords] = useState<string[]>([])
    const [suggestedKey, setSuggestedKey] = useState<string | null>(null)
    const [showAllChords, setShowAllChords] = useState<boolean>(false)
    const [keysWithChords, setKeysWithChords] = useState<Record<string, string[]>>({})
    const [newKey, setNewKey] = useState<string>("C")
    const [isAddKeyDialogOpen, setIsAddKeyDialogOpen] = useState<boolean>(false)

    const allKeys = getAllKeys()

    // ตรวจจับคอร์ดในเนื้อเพลง
    useEffect(() => {
        if (!lyrics) {
            setDetectedChords([])
            setSuggestedKey(null)
            setKeysWithChords({})
            return
        }

        // ค้นหาคอร์ดทั้งหมดในเนื้อเพลง
        const chordRegex = /\[([A-G][b#]?[^[\]]*)\]/g
        const matches = lyrics.match(chordRegex) || []

        // แยกคอร์ดหลักออกมา (เช่น C จาก Cmaj7, G จาก G7)
        const rootChords = matches
            .map((match) => {
                // ตัดวงเล็บเหลี่ยมออก
                const chord = match.substring(1, match.length - 1)

                // แยกคอร์ดหลัก
                const rootMatch = chord.match(/^([A-G][b#]?)/)
                return rootMatch ? rootMatch[1] : null
            })
            .filter(Boolean) as string[]

        // ลบคอร์ดซ้ำ
        const uniqueChords = [...new Set(rootChords)]

        // เรียงคอร์ดตามลำดับ C, C#, D, D#, ...
        const orderedChords = uniqueChords.sort((a, b) => {
            const allKeys = getAllKeys()
            return allKeys.indexOf(a) - allKeys.indexOf(b)
        })

        setDetectedChords(orderedChords)

        // วิเคราะห์คีย์ที่น่าจะเป็น
        if (orderedChords.length > 0) {
            const possibleKey = analyzeKey(orderedChords)
            setSuggestedKey(possibleKey)

            // สร้างข้อมูลว่าคีย์ไหนมีคอร์ดอะไรบ้าง
            const keyChordMap: Record<string, string[]> = {
                [currentKey]: orderedChords,
            }

            if (possibleKey && possibleKey !== currentKey) {
                keyChordMap[possibleKey] = orderedChords
            }

            setKeysWithChords(keyChordMap)
        } else {
            setSuggestedKey(null)
            setKeysWithChords({})
        }
    }, [lyrics, currentKey])

    // วิเคราะห์คีย์จากคอร์ดที่พบ
    const analyzeKey = (chords: string[]): string | null => {
        if (chords.length === 0) return null

        // ตารางคอร์ดหลักในแต่ละคีย์
        const keyChords: Record<string, string[]> = {
            C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
            G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
            D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
            A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
            E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
            B: ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
            "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
            Db: ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
            Ab: ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
            Eb: ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
            Bb: ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
            F: ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
        }

        // ตรวจสอบว่าคอร์ดแรกเป็นคอร์ดหลักของคีย์ไหน
        const firstChord = chords[0]

        // ถ้าคอร์ดแรกเป็นคอร์ดเมเจอร์ มักจะเป็นคอร์ด I ของคีย์นั้น
        for (const [key, keyChordList] of Object.entries(keyChords)) {
            if (firstChord === key) {
                // ตรวจสอบว่ามีคอร์ดอื่นๆ ในคีย์นี้หรือไม่
                const otherKeyChords = keyChordList
                    .slice(1)
                    .map((chord) => chord.replace("m", "").replace("dim", ""))
                const matchCount = chords.filter((chord) => otherKeyChords.includes(chord)).length

                if (matchCount > 0 || chords.length === 1) {
                    return key
                }
            }
        }

        // ถ้าไม่สามารถวิเคราะห์ได้ ให้ใช้คอร์ดแรกเป็นคีย์
        return firstChord
    }

    // เพิ่มคีย์ใหม่
    const handleAddKey = () => {
        if (newKey && detectedChords.length > 0) {
            // เพิ่มคีย์ใหม่เข้าไปในรายการคีย์ที่มีคอร์ด
            setKeysWithChords((prev) => ({
                ...prev,
                [newKey]: detectedChords,
            }))

            // ถ้าเป็นการเพิ่มคีย์แรก ให้ตั้งเป็นคีย์ปัจจุบัน
            if (Object.keys(keysWithChords).length === 0) {
                onKeyChange(newKey)
            }

            setIsAddKeyDialogOpen(false)
        }
    }

    // แสดงคอร์ดทั้งหมดหรือแสดงเฉพาะ 5 คอร์ดแรก
    const displayedChords = showAllChords ? detectedChords : detectedChords.slice(0, 5)

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Music className="h-4 w-4" />
                    <span>คอร์ดที่พบในเนื้อเพลง:</span>
                </div>
                {detectedChords.length > 5 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllChords(!showAllChords)}
                        className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
                    >
                        {showAllChords ? "แสดงน้อยลง" : `แสดงทั้งหมด (${detectedChords.length})`}
                    </Button>
                )}
            </div>

            {detectedChords.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                        {displayedChords.map((chord) => (
                            <Badge
                                key={chord}
                                className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                            >
                                {chord}
                            </Badge>
                        ))}
                        {!showAllChords && detectedChords.length > 5 && (
                            <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                +{detectedChords.length - 5} คอร์ด
                            </Badge>
                        )}
                    </div>

                    {/* แสดงคีย์ที่มีคอร์ดแล้ว */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                คีย์ที่มีคอร์ด:
                            </h4>

                            <Dialog open={isAddKeyDialogOpen} onOpenChange={setIsAddKeyDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2 text-xs border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900"
                                    >
                                        <Plus className="h-3.5 w-3.5 mr-1" />
                                        เพิ่มคีย์
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-800">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                                            เพิ่มคีย์ใหม่
                                        </DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                เลือกคีย์ที่ต้องการเพิ่ม
                                            </label>
                                            <Select value={newKey} onValueChange={setNewKey}>
                                                <SelectTrigger className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                                    <SelectValue placeholder="เลือกคีย์" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                                                    {allKeys.map((key) => (
                                                        <SelectItem
                                                            key={key}
                                                            value={key}
                                                            className={cn(
                                                                "text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900",
                                                                Object.keys(
                                                                    keysWithChords
                                                                ).includes(key) &&
                                                                    "text-gray-400 dark:text-gray-600"
                                                            )}
                                                            disabled={Object.keys(
                                                                keysWithChords
                                                            ).includes(key)}
                                                        >
                                                            {key}{" "}
                                                            {Object.keys(keysWithChords).includes(
                                                                key
                                                            ) && "(มีแล้ว)"}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            คอร์ดที่จะถูกเพิ่มในคีย์ {newKey}:
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {detectedChords.map((chord) => (
                                                    <Badge
                                                        key={chord}
                                                        className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                                    >
                                                        {chord}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsAddKeyDialogOpen(false)}
                                            className="border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                                        >
                                            ยกเลิก
                                        </Button>
                                        <Button
                                            onClick={handleAddKey}
                                            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                                        >
                                            เพิ่มคีย์
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                            {Object.keys(keysWithChords).length > 0 ? (
                                <div className="space-y-3">
                                    {Object.entries(keysWithChords).map(([key, chords]) => (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    className={cn(
                                                        "cursor-pointer",
                                                        key === currentKey
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                            : "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                                                    )}
                                                    onClick={() => onKeyChange(key)}
                                                >
                                                    {key}
                                                    {key === currentKey && (
                                                        <Check className="ml-1 h-3 w-3" />
                                                    )}
                                                </Badge>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    ({chords.length} คอร์ด)
                                                </span>
                                            </div>

                                            {key !== currentKey && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onKeyChange(key)}
                                                    className="h-6 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
                                                >
                                                    ใช้คีย์นี้
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                                    ยังไม่มีคีย์ที่กำหนด กรุณาเพิ่มคีย์
                                </div>
                            )}
                        </div>
                    </div>

                    {suggestedKey && !Object.keys(keysWithChords).includes(suggestedKey) && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">คีย์ที่แนะนำ:</span>
                            <Badge
                                className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800 cursor-pointer"
                                onClick={() => {
                                    setKeysWithChords((prev) => ({
                                        ...prev,
                                        [suggestedKey]: detectedChords,
                                    }))
                                    onKeyChange(suggestedKey)
                                }}
                            >
                                {suggestedKey}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setKeysWithChords((prev) => ({
                                        ...prev,
                                        [suggestedKey]: detectedChords,
                                    }))
                                    onKeyChange(suggestedKey)
                                }}
                                className="h-7 px-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900"
                            >
                                ใช้คีย์นี้
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>ไม่พบคอร์ดในเนื้อเพลง กรุณาเพิ่มคอร์ดในรูปแบบ [C], [G], [Am]</span>
                </div>
            )}
        </div>
    )
}
