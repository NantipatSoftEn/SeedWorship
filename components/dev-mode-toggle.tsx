"use client"

import { useEffect } from "react"
import { Code2 } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { cn } from "@/lib/utils"

interface DevModeToggleProps {
  isDevMode: boolean
  onToggle: (isDevMode: boolean) => void
  className?: string
}

export function DevModeToggle({ isDevMode, onToggle, className }: DevModeToggleProps): JSX.Element {
  // ใช้ localStorage เพื่อจำค่า dev mode ระหว่างการรีเฟรชหน้า
  useEffect(() => {
    const savedDevMode = localStorage.getItem("seedtrack_dev_mode")
    if (savedDevMode !== null) {
      onToggle(savedDevMode === "true")
    }
  }, [onToggle])

  const handleToggle = () => {
    const newValue = !isDevMode
    localStorage.setItem("seedtrack_dev_mode", String(newValue))
    onToggle(newValue)
  }

  return (
    <Button
      variant={isDevMode ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-1",
        isDevMode ? "bg-amber-600 hover:bg-amber-700 text-white" : "text-amber-600",
        className,
      )}
      title={isDevMode ? "ปิดโหมดนักพัฒนา" : "เปิดโหมดนักพัฒนา"}
    >
      <Code2 className="h-4 w-4" />
      <span className="hidden sm:inline">{isDevMode ? "Dev Mode" : "Dev Mode"}</span>
    </Button>
  )
}
