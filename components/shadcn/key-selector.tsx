"use client"
import { Music } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { getAllKeys } from "@/utils/chord-transposer"
import { cn } from "@/lib/utils"

interface KeySelectorProps {
  currentKey: string
  originalKey: string
  onKeyChange: (newKey: string) => void
  className?: string
}

export function KeySelector({ currentKey, originalKey, onKeyChange, className }: KeySelectorProps): JSX.Element {
  const allKeys = getAllKeys()

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
        <Music className="h-3.5 w-3.5 mr-1" />
        <span>คีย์:</span>
      </div>
      <Select value={currentKey} onValueChange={onKeyChange}>
        <SelectTrigger className="h-7 min-w-[80px] px-2 text-xs border-blue-100 dark:border-blue-800 bg-white dark:bg-gray-800">
          <SelectValue placeholder="เลือกคีย์" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
          {allKeys.map((key) => (
            <SelectItem
              key={key}
              value={key}
              className={cn("text-xs", key === originalKey && "font-medium text-blue-600 dark:text-blue-400")}
            >
              {key}
              {key === originalKey ? " (คีย์เดิม)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentKey !== originalKey && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onKeyChange(originalKey)}
          className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
        >
          รีเซ็ต
        </Button>
      )}
    </div>
  )
}
