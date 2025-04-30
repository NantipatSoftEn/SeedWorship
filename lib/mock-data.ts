import type { Song } from "@/types/song"

// สร้างข้อมูลเพลงจำลอง
export const mockSongs: Song[] = [
  {
    id: "mock-song-1",
    title: "พระคุณพระเจ้า",
    artist: "คณะนักร้องประสานเสียง",
    category: "worship",
    language: "thai",
    lyrics: `[G]พระคุณพระเจ้านั้น[D]สูงส่ง
[Em]เลิศล้ำยิ่งใหญ่[C]เหลือจะ[D]กล่าว
[G]พระคุณพระเจ้านั้น[D]ยิ่งใหญ่
[Em]ไถ่เราให้[C]พ้นความ[D]ตาย

[G]พระคุณ[D]นำเรา[Em]มาถึง[C]พระองค์
[G]พระคุณ[D]ชำระ[Em]ใจของ[C]เรา
[G]พระคุณ[D]ทรงนำ[Em]ชีวิต[C]เรา
[G]พระคุณ[D]ค้ำชู[Em]เราทุก[C]วัน[D]

[G]พระคุณพระเจ้านั้น[D]ยิ่งใหญ่
[Em]ไถ่เราให้[C]พ้นความ[D]ตาย`,
    tags: ["slow", "hymn"],
    show_chords: true,
    created_at: "2023-01-15T08:00:00.000Z",
    updated_at: "2023-01-15T08:00:00.000Z",
    user_id: "mock-user-1",
    user_info: {
      username: "admin",
      display_name: "ผู้ดูแลระบบ",
    },
    is_favorite: false,
  },
  {
    id: "mock-song-2",
    title: "Amazing Grace",
    artist: "John Newton",
    category: "praise",
    language: "english",
    lyrics: `[G]Amazing [D]grace how [G]sweet the [D]sound
That [G]saved a [D]wretch like [G]me
I [G]once was [D]lost but [G]now am [D]found
Was [G]blind but [D]now I [G]see

[G]'Twas [D]grace that [G]taught my [D]heart to [G]fear
And [D]grace my [G]fears re[D]lieved
How [G]precious [D]did that [G]grace ap[D]pear
The [G]hour I [D]first be[G]lieved`,
    tags: ["slow", "hymn", "contemporary"],
    show_chords: true,
    created_at: "2023-02-20T10:30:00.000Z",
    updated_at: "2023-02-20T10:30:00.000Z",
    user_id: "mock-user-2",
    user_info: {
      username: "worship_leader",
      display_name: "ผู้นำนมัสการ",
    },
    is_favorite: true,
  },
  {
    id: "mock-song-3",
    title: "สรรเสริญพระเจ้าผู้อำนวยพร",
    artist: "คณะนักร้องคริสตจักร",
    category: "praise",
    language: "thai",
    lyrics: `[D]สรรเสริญ[A]พระเจ้า[D]ผู้อำนวย[G]พร
[D]ทรงโปรด[A]ประทาน[D]พระบุตร[A]มา
[D]ทุกชน[A]ชาติ[D]ทั่วโลกา[G]
[D]จงสรร[A]เสริญ[D]พระนาม[A]พระ[D]องค์

[D]สรรเสริญ[A]พระเจ้า[D]ผู้อำนวย[G]พร
[D]ทรงโปรด[A]ประทาน[D]พระบุตร[A]มา
[D]ทุกชน[A]ชาติ[D]ทั่วโลกา[G]
[D]จงสรร[A]เสริญ[D]พระนาม[A]พระ[D]องค์`,
    tags: ["fast", "contemporary"],
    show_chords: true,
    created_at: "2023-03-10T14:15:00.000Z",
    updated_at: "2023-03-10T14:15:00.000Z",
    user_id: "mock-user-3",
    user_info: {
      username: "church_musician",
      display_name: "นักดนตรีคริสตจักร",
    },
    is_favorite: false,
  },
]
