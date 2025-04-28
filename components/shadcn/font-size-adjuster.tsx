"use client"

import { MinusCircle, PlusCircle, Type } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { JSX } from "react"

interface FontSizeAdjusterProps {
  onSizeChange: (size: string) => void
  className?: string
}

export function FontSizeAdjuster({ onSizeChange, className }: FontSizeAdjusterProps): JSX.Element {
  const [currentSize, setCurrentSize] = useState<string>("medium")

  const sizes = {
    small: "เล็ก",
    medium: "กลาง",
    large: "ใหญ่",
    xlarge: "ใหญ่มาก",
  }

  const handleSizeChange = (size: string): void => {
    setCurrentSize(size)
    onSizeChange(size)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
        <Type className="h-3 w-3 mr-1" />
        ขนาดตัวอักษร:
      </span>
      <div className="flex items-center border border-blue-100 dark:border-blue-800 rounded-md overflow-hidden">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const sizeKeys = Object.keys(sizes)
            const currentIndex = sizeKeys.indexOf(currentSize)
            if (currentIndex > 0) {
              handleSizeChange(sizeKeys[currentIndex - 1])
            }
          }}
          disabled={currentSize === "small"}
          className="h-7 px-2 rounded-none border-r border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400"
        >
          <MinusCircle className="h-3.5 w-3.5" />
          <span className="sr-only">ลดขนาดตัวอักษร</span>
        </Button>

        <span className="px-2 text-xs text-blue-800 dark:text-blue-300 min-w-[50px] text-center">
          {sizes[currentSize as keyof typeof sizes]}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const sizeKeys = Object.keys(sizes)
            const currentIndex = sizeKeys.indexOf(currentSize)
            if (currentIndex < sizeKeys.length - 1) {
              handleSizeChange(sizeKeys[currentIndex + 1])
            }
          }}
          disabled={currentSize === "xlarge"}
          className="h-7 px-2 rounded-none border-l border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only">เพิ่มขนาดตัวอักษร</span>
        </Button>
      </div>
    </div>
  )
}
