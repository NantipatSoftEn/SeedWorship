import React from "react"

// ฟังก์ชันสำหรับแสดงเนื้อเพลงพร้อมหรือไม่พร้อมคอร์ด
export const formatLyricsWithChords = (
    lyrics: string,
    showChords: boolean,
    fontSize = "medium"
): React.ReactNode => {
    if (!lyrics) return null

    if (showChords) {
        // แสดงเนื้อเพลงพร้อมคอร์ด
        return (
            <div
                className={`whitespace-pre-wrap font-sarabun text-gray-700 dark:text-gray-300 ${getFontSizeClass(fontSize)} leading-relaxed`}
            >
                {lyrics}
            </div>
        )
    } else {
        // ซ่อนคอร์ด (ลบข้อความในวงเล็บเหลี่ยม)
        const lyricsWithoutChords = lyrics.replace(/\[.*?\]/g, "")

        return (
            <div
                className={`whitespace-pre-wrap font-sarabun text-gray-700 dark:text-gray-300 ${getFontSizeClass(fontSize)} leading-relaxed`}
            >
                {lyricsWithoutChords}
            </div>
        )
    }
}

// ฟังก์ชันสำหรับแสดงเนื้อเพลงพร้อมคอร์ดที่มีการจัดรูปแบบ
export const formatLyricsWithFormattedChords = (
    lyrics: string,
    showChords: boolean,
    fontSize = "medium"
): React.ReactNode => {
    if (!lyrics) return null

    if (!showChords) {
        // ซ่อนคอร์ด (ลบข้อความในวงเล็บเหลี่ยม)
        const lyricsWithoutChords = lyrics.replace(/\[.*?\]/g, "")

        return (
            <div
                className={`whitespace-pre-wrap font-sarabun text-gray-700 dark:text-gray-300 ${getFontSizeClass(fontSize)} leading-relaxed`}
            >
                {lyricsWithoutChords}
            </div>
        )
    }

    // แยกเนื้อเพลงเป็นบรรทัด
    const lines = lyrics.split("\n")

    return (
        <div
            className={`font-sarabun text-gray-700 dark:text-gray-300 ${getFontSizeClass(fontSize)} leading-relaxed`}
        >
            {lines.map((line, lineIndex) => {
                // แยกคอร์ดและเนื้อเพลงในแต่ละบรรทัด
                const parts = line.split(/(\[.*?\])/g)

                return (
                    <div key={lineIndex} className="mb-1">
                        {parts.map((part, partIndex) => {
                            if (part.startsWith("[") && part.endsWith("]")) {
                                // เป็นคอร์ด - เพิ่มการเน้นคอร์ด
                                return (
                                    <span
                                        key={partIndex}
                                        className="text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-0.5 rounded"
                                    >
                                        {part}
                                    </span>
                                )
                            }
                            return <React.Fragment key={partIndex}>{part}</React.Fragment>
                        })}
                    </div>
                )
            })}
        </div>
    )
}

// ฟังก์ชันสำหรับกำหนดคลาสขนาดตัวอักษรตามขนาดที่เลือก
export const getFontSizeClass = (fontSize: string): string => {
    switch (fontSize) {
        case "small":
            return "text-xs"
        case "medium":
            return "text-sm"
        case "large":
            return "text-base"
        case "xlarge":
            return "text-lg"
        default:
            return "text-sm"
    }
}
