"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps): JSX.Element | null {
    const [mounted, setMounted] = useState<boolean>(false)
    const { theme, setTheme } = useTheme()

    // useEffect เพื่อป้องกัน hydration error
    useEffect(() => {
        setMounted(true)
    }, [])

    // ไม่แสดงอะไรจนกว่า component จะ mount เพื่อป้องกัน hydration mismatch
    if (!mounted) {
        return null
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
                "h-9 w-9 rounded-full border-blue-100 dark:border-blue-800",
                "bg-white hover:bg-blue-50 dark:bg-blue-950 dark:hover:bg-blue-900",
                className
            )}
            aria-label={theme === "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 text-blue-600 dark:text-blue-400 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 text-blue-600 dark:text-blue-400 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">
                {theme === "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
            </span>
        </Button>
    )
}
