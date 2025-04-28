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
  language: SongLanguage // เพิ่มฟิลด์ภาษา
  tags?: SongTag[] // เพิ่มฟิลด์ tags สำหรับระบุแนวเพลง
  showChords?: boolean // เพิ่มตัวเลือกสำหรับแสดง/ซ่อนคอร์ด
  createdAt: string // เพิ่มวันที่ที่เพิ่มเพลง
}
