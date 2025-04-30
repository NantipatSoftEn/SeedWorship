"use client"

import { useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Code } from "lucide-react"

interface DevModeToggleProps {
  isDevMode: boolean
  onToggle: (value: boolean) => void
}

export function DevModeToggle({ isDevMode, onToggle }: DevModeToggleProps): JSX.Element {
  // ใช้ localStorage เพื่อจำค่า dev mode ระหว่างการรีเฟรชหน้า
  useEffect(() => {
    const savedMode = localStorage.getItem("devMode")
    if (savedMode !== null) {
      onToggle(savedMode === "true")
    }
  }, [onToggle])

  const handleToggle = (checked: boolean): void => {
    localStorage.setItem("devMode", String(checked))
    onToggle(checked)
  }

  return (
    <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-1">
      <Code className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <Label htmlFor="dev-mode" className="text-xs font-medium text-amber-800 dark:text-amber-300">
        Dev Mode
      </Label>
      <Switch
        id="dev-mode"
        checked={isDevMode}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-amber-600 dark:data-[state=checked]:bg-amber-700"
      />
    </div>
  )
}
