"use client"

import { AddSongForm as AddSongFormComponent } from "@/components/add-song"
import type { Song } from "@/types/song"

interface AddSongFormProps {
    isOpen: boolean
    onClose: () => void
    onAddSong?: (song: Song) => void
}

export const AddSongForm = ({ isOpen, onClose, onAddSong }: AddSongFormProps): JSX.Element => {
    return <AddSongFormComponent isOpen={isOpen} onClose={onClose} onAddSong={onAddSong} />
}
