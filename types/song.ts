export type SongCategory = "praise" | "worship" | "opening"
export type SongLanguage = "thai" | "english" | "other"

export interface Song {
  id: string
  title: string
  artist: string
  category: string
  lyrics: string
  language: SongLanguage // เพิ่มฟิลด์ภาษา
  showChords?: boolean // เพิ่มตัวเลือกสำหรับแสดง/ซ่อนคอร์ด
  createdAt: string // เพิ่มวันที่ที่เพิ่มเพลง
}
