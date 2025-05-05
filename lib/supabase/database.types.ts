export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            songs: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    title: string
                    artist: string | null
                    lyrics: string | null
                    chords: string | null
                    primary_key_id: string | null
                    user_id: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    title: string
                    artist?: string | null
                    lyrics?: string | null
                    chords?: string | null
                    primary_key_id?: string | null
                    user_id?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    title?: string
                    artist?: string | null
                    lyrics?: string | null
                    chords?: string | null
                    primary_key_id?: string | null
                    user_id?: string | null
                }
            }
            song_keys: {
                Row: {
                    id: string
                    created_at: string
                    key_name: string
                    description: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    key_name: string
                    description?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    key_name?: string
                    description?: string | null
                }
            }
            song_to_keys: {
                Row: {
                    id: string
                    created_at: string
                    song_id: string
                    key_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    song_id: string
                    key_id: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    song_id?: string
                    key_id?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
