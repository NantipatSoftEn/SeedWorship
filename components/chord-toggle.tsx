"use client"

import { Music, MicOffIcon as MusicOff } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { cn } from "@/lib/utils"

interface ChordToggleProps {
    showChords: boolean
    onToggle: () => void
    className?: string
}

export const ChordToggle = ({ showChords, onToggle, className }: ChordToggleProps): JSX.Element => {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className={cn(
                "flex items-center gap-2 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300",
                showChords ? "bg-blue-50 dark:bg-blue-900" : "bg-white dark:bg-gray-800",
                className
            )}
            aria-pressed={showChords}
        >
            {showChords ? (
                <>
                    <Music className="h-4 w-4" />
                    <span>ซ่อนคอร์ด</span>
                </>
            ) : (
                <>
                    <MusicOff className="h-4 w-4" />
                    <span>แสดงคอร์ด</span>
                </>
            )}
        </Button>
    )
}
