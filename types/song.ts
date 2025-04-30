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
  language: SongLanguage
  lyrics: string
  tags?: SongTag[]
  show_chords?: boolean
  user_id?: string | null
  created_at: string
  updated_at?: string
  is_favorite?: boolean
}

export interface UserInfo {
  id: string
  username?: string
  display_name?: string
  avatar_url?: string
}

export interface SongWithUser extends Song {
  user?: UserInfo
}
