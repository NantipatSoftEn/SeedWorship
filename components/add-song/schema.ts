import { z } from "zod"
import type { Song, SongTag } from "@/types/song"

// Define the form schema with validation
export const formSchema = z.object({
    title: z.string().min(1, "กรุณาระบุชื่อเพลง"),
    artist: z.string().min(1, "กรุณาระบุชื่อศิลปิน/วง"),
    category: z.enum(["praise", "worship", "opening"], {
        required_error: "กรุณาเลือกหมวดหมู่",
    }),
    language: z.enum(["thai", "english", "other"], {
        required_error: "กรุณาเลือกภาษา",
    }),
    key: z.string().optional(),
    tags: z.array(z.string()).optional(),
    lyrics: z.string().min(1, "กรุณาระบุเนื้อเพลง"),
})

export type FormValues = z.infer<typeof formSchema>

// Function to create a new song from form values
export const createSongFromFormValues = (
    values: FormValues,
    keysWithChords: Record<string, string[]>
): Song => {
    const now = new Date()
    const createdAt = now.toISOString()

    return {
        id: `song-${Date.now()}`, // Generate a unique ID
        title: values.title,
        artist: values.artist,
        category: values.category,
        language: values.language,
        key: values.key,
        tags: values.tags as SongTag[],
        lyrics: values.lyrics,
        show_chords: true,
        created_at: createdAt,
        chord_keys: Object.keys(keysWithChords),
    }
}
