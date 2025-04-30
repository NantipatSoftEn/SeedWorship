export type SongCategory = "praise" | "worship" | "opening"
export type SongLanguage = "thai" | "english" | "other"
export type SongTag =
  | "slow"
  | "fast"
  | "medium"
  | "acoustic"
  | "electronic"
  | "hymn"
  | "contemporary"
  | "kids"
  | "other"

export interface Song {
  id: string
  title: string
  artist: string
  category: string
  lyrics: string
  language: SongLanguage
  tags?: SongTag[]
  show_chords?: boolean
  created_at: string
  updated_at?: string
  user_id?: string | null
  is_favorite?: boolean
}

export interface SongFormData {
  title: string
  artist: string
  category: SongCategory
  language: SongLanguage
  tags?: SongTag[]
  lyrics: string
}
