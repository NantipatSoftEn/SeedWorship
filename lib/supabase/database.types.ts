export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      songs: {
        Row: {
          id: string
          title: string
          artist: string
          category: string
          language: string
          lyrics: string
          tags: string[] | null
          show_chords: boolean
          user_id: string | null
          created_at: string
          updated_at: string
          key: string | null // คีย์หลักของเพลง
          chord_keys: string[] | null // รายการคีย์ทั้งหมดที่มีคอร์ด
        }
        Insert: {
          id?: string
          title: string
          artist: string
          category: string
          language: string
          lyrics: string
          tags?: string[] | null
          show_chords?: boolean
          user_id?: string | null
          created_at?: string
          updated_at?: string
          key?: string | null // คีย์หลักของเพลง
          chord_keys?: string[] | null // รายการคีย์ทั้งหมดที่มีคอร์ด
        }
        Update: {
          id?: string
          title?: string
          artist?: string
          category?: string
          language?: string
          lyrics?: string
          tags?: string[] | null
          show_chords?: boolean
          user_id?: string | null
          created_at?: string
          updated_at?: string
          key?: string | null // คีย์หลักของเพลง
          chord_keys?: string[] | null // รายการคีย์ทั้งหมดที่มีคอร์ด
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          song_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          song_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          song_id?: string
          created_at?: string
        }
      }
    }
  }
}
