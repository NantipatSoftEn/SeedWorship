export interface Song {
  id: string
  title: string
  artist: string
  category: string
  language: string
  lyrics: string
  tags: string[]
  show_chords: boolean
  user_id?: string
  created_at: string
  updated_at: string
}

export interface UserInfo {
  id: string
  username: string
  display_name: string
  avatar_url: string
}

export interface SongWithUser extends Song {
  user?: UserInfo
}

export interface UserSession {
  user: {
    id: string
    email?: string
  } | null
}
