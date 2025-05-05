"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

interface SearchSuggestionsProps {
    suggestions: string[]
    onSelectSuggestion: (suggestion: string) => void
    isVisible: boolean
    className?: string
}

export const SearchSuggestions = ({
    suggestions,
    onSelectSuggestion,
    isVisible,
    className,
}: SearchSuggestionsProps): JSX.Element | null => {
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const suggestionsRef = useRef<HTMLDivElement>(null)

    // รีเซ็ตตัวเลือกที่เลือกเมื่อรายการคำแนะนำเปลี่ยน
    useEffect(() => {
        setSelectedIndex(-1)
    }, [suggestions])

    // จัดการการกดปุ่มลูกศรขึ้น/ลง และ Enter
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (!isVisible || suggestions.length === 0) return

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault()
                    setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
                    break
                case "ArrowUp":
                    e.preventDefault()
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
                    break
                case "Enter":
                    e.preventDefault()
                    if (selectedIndex >= 0) {
                        onSelectSuggestion(suggestions[selectedIndex])
                    }
                    break
                case "Escape":
                    e.preventDefault()
                    setSelectedIndex(-1)
                    break
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isVisible, suggestions, selectedIndex, onSelectSuggestion])

    if (!isVisible || suggestions.length === 0) {
        return null
    }

    return (
        <div
            ref={suggestionsRef}
            className={cn(
                "absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-800 rounded-md shadow-lg max-h-60 overflow-y-auto",
                className
            )}
        >
            <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        className={cn(
                            "px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900",
                            selectedIndex === index &&
                                "bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                        )}
                        onClick={() => onSelectSuggestion(suggestion)}
                    >
                        {suggestion}
                    </li>
                ))}
            </ul>
        </div>
    )
}
