"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/shadcn/badge"
import { Command, CommandGroup, CommandItem } from "@/components/shadcn/command"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@/lib/utils"

interface MultiSelectProps {
    options: { label: string; value: string; color?: string }[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    className?: string
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "เลือกตัวเลือก...",
    className,
}: MultiSelectProps): JSX.Element {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    const handleUnselect = (item: string): void => {
        onChange(selected.filter((i) => i !== item))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        const input = inputRef.current
        if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "" && selected.length > 0) {
                    onChange(selected.slice(0, -1))
                }
            }
            // This is not a default behavior of the <input /> field
            if (e.key === "Escape") {
                input.blur()
            }
        }
    }

    const selectables = options.filter((option) => !selected.includes(option.value))

    return (
        <Command
            onKeyDown={handleKeyDown}
            className={cn(
                "overflow-visible bg-white dark:bg-gray-800 rounded-md border border-input",
                "min-h-10 w-full flex items-center flex-wrap gap-1 p-1 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                className
            )}
        >
            <div className="flex flex-wrap gap-1">
                {selected.map((item) => {
                    const option = options.find((o) => o.value === item)
                    return (
                        <Badge
                            key={item}
                            variant="secondary"
                            className={cn(
                                "rounded-sm px-1 py-0 text-xs font-normal",
                                option?.color || "bg-secondary text-secondary-foreground"
                            )}
                        >
                            {option?.label || item}
                            <button
                                type="button"
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleUnselect(item)
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                                onClick={() => handleUnselect(item)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                <span className="sr-only">ลบ {option?.label || item}</span>
                            </button>
                        </Badge>
                    )
                })}
                <CommandPrimitive.Input
                    ref={inputRef}
                    value={inputValue}
                    onValueChange={setInputValue}
                    onBlur={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                    placeholder={selected.length === 0 ? placeholder : undefined}
                    className="ml-1 flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] h-8"
                />
            </div>
            <div className="relative">
                {open && selectables.length > 0 && (
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandGroup className="h-full overflow-auto max-h-[200px]">
                            {selectables.map((option) => {
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onSelect={() => {
                                            setInputValue("")
                                            onChange([...selected, option.value])
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </div>
                )}
            </div>
        </Command>
    )
}
