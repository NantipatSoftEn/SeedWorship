import type { Song } from "@/types/song"

// Mock data for demonstration - 3 เพลงตามที่ต้องการ
export const mockSongs: Song[] = [
    {
        id: "1",
        title: "พระเจ้าทรงเป็นความรัก",
        artist: "คณะนักร้องประสานเสียง",
        category: "praise",
        language: "thai",
        tags: ["slow", "contemporary"],
        lyrics: "[G]พระเจ้าทรงเป็นความ[D]รัก\n[C]พระองค์ทรงรัก[G]เรา\n[G]พระเจ้าทรงเป็นความ[D]รัก\n[C]พระองค์ทรงรัก[G]เรา\n\n[Em]พระองค์ทรงส่งพระ[D]บุตร\n[C]มาสิ้นพระชนม์เพื่อ[G]เรา\n[Em]เพื่อเราจะได้มี[D]ชีวิต\n[C]ชีวิตนิรัน[G]ดร์",
        show_chords: true,
        key: "G", // เพิ่มคีย์
        user_id: null,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "2",
        title: "พระคุณพระเจ้า",
        artist: "วงศ์วานวิหาร",
        category: "worship",
        language: "thai",
        tags: ["slow", "hymn"],
        lyrics: "[G]พระคุณพระเจ้านั้นแสน[D]ชื่นใจ\n[C]ช่วยคนบาปอย่าง[G]ฉันได้รอด\n[Em]ฉันหลงทางพระองค์[D]ตามหา\n[C]ฉันตาบอดแต่เดี๋ยวนี้[G]เห็นแล้ว",
        show_chords: true,
        key: "G", // เพิ่มคีย์
        user_id: null,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "3",
        title: "ขอบคุณพระเจ้า",
        artist: "คริสตจักรสัมพันธ์",
        category: "opening",
        language: "thai",
        tags: ["medium", "contemporary"],
        lyrics: "[C]ขอบคุณพระเจ้า สำหรับความ[G]รักของพระองค์\n[F]ขอบคุณพระเจ้า สำหรับพระ[C]พรทุกอย่าง\n[C]ขอบคุณพระเจ้า สำหรับการ[G]ทรงนำ\n[F]ขอบคุณพระเจ้า สำหรับชีวิต[C]ใหม่",
        show_chords: true,
        key: "C", // เพิ่มคีย์
        user_id: null,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
]
