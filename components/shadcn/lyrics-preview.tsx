"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { formatLyricsWithFormattedChords } from "@/utils/format-lyrics"
import { cn } from "@/lib/utils"

interface LyricsPreviewProps {
    lyrics: string
    className?: string
}

export function LyricsPreview({ lyrics, className }: LyricsPreviewProps): JSX.Element {
    const [showChords, setShowChords] = useState<boolean>(true)

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    ตัวอย่างเนื้อเพลง
                </h4>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowChords(!showChords)}
                    className="h-8 text-xs border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                >
                    {showChords ? (
                        <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            ซ่อนคอร์ด
                        </>
                    ) : (
                        <>
                            <Eye className="h-3 w-3 mr-1" />
                            แสดงคอร์ด
                        </>
                    )}
                </Button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-700 max-h-40 overflow-y-auto">
                {formatLyricsWithFormattedChords(lyrics, showChords, "medium")}
            </div>
        </div>
    )
}
