"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { AddSongForm } from "@/components/add-song-form"
import type { Song } from "@/types/song"

interface AddSongButtonProps {
    className?: string
    onAddSong?: (song: Song) => void
}

export const AddSongButton = ({ className, onAddSong }: AddSongButtonProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <>
            <Button className={className} onClick={() => setIsOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มเพลงใหม่
            </Button>
            <AddSongForm isOpen={isOpen} onClose={() => setIsOpen(false)} onAddSong={onAddSong} />
        </>
    )
}
