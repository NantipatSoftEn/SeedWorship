"use client"

import { Badge } from "@/components/shadcn/badge"
import { cn } from "@/lib/utils"
import { Tag } from "lucide-react"
import type { SongTag } from "@/types/song"

interface TagOption {
    label: string
    value: SongTag
    color: string
}

interface TagSelectorProps {
    selectedTags: SongTag[]
    onChange: (tags: SongTag[]) => void
    className?: string
}

export function TagSelector({ selectedTags, onChange, className }: TagSelectorProps): JSX.Element {
    // ตัวเลือกสำหรับ tags
    const tagOptions: TagOption[] = [
        {
            label: "เพลงช้า",
            value: "slow",
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        },
        {
            label: "เพลงเร็ว",
            value: "fast",
            color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        },
        {
            label: "เพลงปานกลาง",
            value: "medium",
            color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        },
        {
            label: "อะคูสติก",
            value: "acoustic",
            color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
        },
        {
            label: "อิเล็กทรอนิกส์",
            value: "electronic",
            color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        },
        {
            label: "เพลงนมัสการดั้งเดิม",
            value: "hymn",
            color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
        },
        {
            label: "เพลงนมัสการร่วมสมัย",
            value: "contemporary",
            color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
        },
        {
            label: "เพลงสำหรับเด็ก",
            value: "kids",
            color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        },
        {
            label: "อื่นๆ",
            value: "other",
            color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        },
    ]

    const toggleTag = (tag: SongTag): void => {
        if (selectedTags.includes(tag)) {
            // ถ้ามีแท็กนี้อยู่แล้ว ให้ลบออก
            onChange(selectedTags.filter((t) => t !== tag))
        } else {
            // ถ้ายังไม่มีแท็กนี้ ให้เพิ่มเข้าไป
            onChange([...selectedTags, tag])
        }
    }

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Tag className="h-4 w-4" />
                <span>เลือกแท็กเพลง (เลือกได้หลายรายการ)</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {tagOptions.map((option) => {
                    return (
                        <Badge
                            key={option.value}
                            className={cn(
                                "cursor-pointer transition-all",
                                selectedTags.includes(option.value)
                                    ? option.color
                                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                            onClick={() => toggleTag(option.value)}
                        >
                            {selectedTags.includes(option.value) && (
                                <span className="mr-1 text-xs">✓</span>
                            )}
                            {option.label}
                        </Badge>
                    )
                })}
            </div>
        </div>
    )
}
