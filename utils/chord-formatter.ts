/**
 * แปลงรูปแบบคอร์ดจากรูปแบบที่คอร์ดอยู่ด้านบนเนื้อเพลง
 * ให้เป็นรูปแบบที่คอร์ดอยู่ในวงเล็บเหลี่ยม [คอร์ด]
 */
export function convertChordFormat(input: string): string {
    if (!input) return ""

    // แยกเนื้อเพลงเป็นบรรทัด
    const lines = input.split("\n")
    const result: string[] = []

    // วนลูปทีละคู่บรรทัด (บรรทัดคอร์ดและบรรทัดเนื้อเพลง)
    for (let i = 0; i < lines.length; i += 2) {
        const chordLine = lines[i]
        const lyricLine = lines[i + 1]

        // ถ้าไม่มีบรรทัดเนื้อเพลง หรือบรรทัดนี้ไม่ใช่บรรทัดคอร์ด ให้เก็บบรรทัดนั้นไว้และข้ามไป
        if (!lyricLine || !isChordLine(chordLine)) {
            result.push(chordLine)
            continue
        }

        // แปลงคอร์ดและเนื้อเพลง
        const formattedLine = formatLineWithChords(chordLine, lyricLine)
        result.push(formattedLine)
    }

    return result.join("\n")
}

/**
 * ตรวจสอบว่าบรรทัดนี้เป็นบรรทัดคอร์ดหรือไม่
 * โดยดูจากการมีช่องว่างนำหน้าและมีคอร์ดที่รู้จัก
 */
function isChordLine(line: string): boolean {
    // ถ้าบรรทัดว่างเปล่า ไม่ใช่บรรทัดคอร์ด
    if (!line.trim()) return false

    // ถ้าบรรทัดไม่มีช่องว่างนำหน้า อาจไม่ใช่บรรทัดคอร์ด
    if (!line.startsWith(" ")) return false

    // รายการคอร์ดที่รู้จัก (สามารถเพิ่มเติมได้)
    const knownChords = [
        "A",
        "Am",
        "A7",
        "Am7",
        "Amaj7",
        "Adim",
        "Asus",
        "Asus4",
        "Asus2",
        "Aaug",
        "A#",
        "A#m",
        "A#7",
        "B",
        "Bm",
        "B7",
        "Bm7",
        "Bmaj7",
        "Bdim",
        "Bsus",
        "Bsus4",
        "Bsus2",
        "Baug",
        "Bb",
        "Bbm",
        "Bb7",
        "C",
        "Cm",
        "C7",
        "Cm7",
        "Cmaj7",
        "Cdim",
        "Csus",
        "Csus4",
        "Csus2",
        "Caug",
        "C#",
        "C#m",
        "C#7",
        "D",
        "Dm",
        "D7",
        "Dm7",
        "Dmaj7",
        "Ddim",
        "Dsus",
        "Dsus4",
        "Dsus2",
        "Daug",
        "D#",
        "D#m",
        "D#7",
        "E",
        "Em",
        "E7",
        "Em7",
        "Emaj7",
        "Edim",
        "Esus",
        "Esus4",
        "Esus2",
        "Eaug",
        "Eb",
        "Ebm",
        "Eb7",
        "F",
        "Fm",
        "F7",
        "Fm7",
        "Fmaj7",
        "Fdim",
        "Fsus",
        "Fsus4",
        "Fsus2",
        "Faug",
        "F#",
        "F#m",
        "F#7",
        "G",
        "Gm",
        "G7",
        "Gm7",
        "Gmaj7",
        "Gdim",
        "Gsus",
        "Gsus4",
        "Gsus2",
        "Gaug",
        "G#",
        "G#m",
        "G#7",
    ]

    // ตรวจสอบว่ามีคอร์ดที่รู้จักอยู่ในบรรทัดหรือไม่
    const words = line.trim().split(/\s+/)
    return words.some((word) => knownChords.includes(word))
}

/**
 * แปลงบรรทัดคอร์ดและบรรทัดเนื้อเพลงให้เป็นบรรทัดเดียวกัน
 * โดยใส่คอร์ดในวงเล็บเหลี่ยม [คอร์ด] ก่อนคำที่ตรงกับตำแหน่งคอร์ด
 */
function formatLineWithChords(chordLine: string, lyricLine: string): string {
    // หาตำแหน่งของคอร์ดทั้งหมดในบรรทัด
    const chords: { position: number; chord: string }[] = []
    const currentPosition = 0

    // แยกบรรทัดคอร์ดเป็นช่องว่างและคอร์ด
    const chordMatches = chordLine.matchAll(/\S+/g)
    for (const match of chordMatches) {
        if (match.index !== undefined) {
            chords.push({
                position: match.index,
                chord: match[0],
            })
        }
    }

    // เรียงคอร์ดตามตำแหน่งจากมากไปน้อย เพื่อให้แทรกจากท้ายไปหน้า
    chords.sort((a, b) => b.position - a.position)

    // แทรกคอร์ดลงในเนื้อเพลง
    let result = lyricLine
    for (const { position, chord } of chords) {
        // หาตำแหน่งในเนื้อเพลงที่ตรงกับตำแหน่งคอร์ด
        // โดยปรับให้ตรงกับตัวอักษรแรกของคำในเนื้อเพลง
        let lyricPosition = position

        // ปรับตำแหน่งให้ไม่เกินความยาวของเนื้อเพลง
        lyricPosition = Math.min(lyricPosition, result.length)

        // ถ้าตำแหน่งเป็นช่องว่าง ให้หาตำแหน่งของตัวอักษรถัดไป
        while (lyricPosition < result.length && result[lyricPosition] === " ") {
            lyricPosition++
        }

        // ถ้าตำแหน่งเกินความยาวของเนื้อเพลง ให้ใส่คอร์ดไว้ท้ายบรรทัด
        if (lyricPosition >= result.length) {
            result = result + ` [${chord}]`
        } else {
            // แทรกคอร์ดที่ตำแหน่งที่ปรับแล้ว
            result =
                result.substring(0, lyricPosition) + `[${chord}]` + result.substring(lyricPosition)
        }
    }

    return result
}

/**
 * แปลงรูปแบบคอร์ดแบบอัตโนมัติ โดยตรวจสอบรูปแบบของเนื้อเพลงก่อน
 */
export function autoConvertChordFormat(input: string): string {
    if (!input) return ""

    // ตรวจสอบว่าเนื้อเพลงมีคอร์ดในวงเล็บเหลี่ยมอยู่แล้วหรือไม่
    if (input.includes("[") && input.includes("]")) {
        return input // มีคอร์ดในวงเล็บเหลี่ยมอยู่แล้ว ไม่ต้องแปลง
    }

    // ตรวจสอบว่าเนื้อเพลงมีรูปแบบที่คอร์ดอยู่ด้านบนหรือไม่
    const lines = input.split("\n")
    let hasChordLines = false

    for (let i = 0; i < lines.length - 1; i++) {
        if (isChordLine(lines[i])) {
            hasChordLines = true
            break
        }
    }

    if (hasChordLines) {
        return convertChordFormat(input)
    }

    return input // ไม่พบรูปแบบคอร์ดที่รู้จัก ไม่ต้องแปลง
}
