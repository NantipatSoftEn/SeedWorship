import type { KeyAnalysisResult } from "@/components/key-analyzer/types/key-analysis"

// คอร์ดที่พบบ่อยในแต่ละคีย์ (เมเจอร์)
const MAJOR_KEY_CHORDS: Record<string, string[]> = {
    C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim", "G7", "C7", "Fmaj7", "Cmaj7"],
    "C#": ["C#", "D#m", "Fm", "F#", "G#", "A#m", "Cdim", "G#7", "C#7", "F#maj7", "C#maj7"],
    D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim", "A7", "D7", "Gmaj7", "Dmaj7"],
    "D#": ["D#", "Fm", "Gm", "G#", "A#", "Cm", "Ddim", "A#7", "D#7", "G#maj7", "D#maj7"],
    E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim", "B7", "E7", "Amaj7", "Emaj7"],
    F: ["F", "Gm", "Am", "A#", "C", "Dm", "Edim", "C7", "F7", "A#maj7", "Fmaj7"],
    "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "Fdim", "C#7", "F#7", "Bmaj7", "F#maj7"],
    G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim", "D7", "G7", "Cmaj7", "Gmaj7"],
    "G#": ["G#", "A#m", "Cm", "C#", "D#", "Fm", "Gdim", "D#7", "G#7", "C#maj7", "G#maj7"],
    A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim", "E7", "A7", "Dmaj7", "Amaj7"],
    "A#": ["A#", "Cm", "Dm", "D#", "F", "Gm", "Adim", "F7", "A#7", "D#maj7", "A#maj7"],
    B: ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim", "F#7", "B7", "Emaj7", "Bmaj7"],
}

// คอร์ดที่พบบ่อยในแต่ละคีย์ (ไมเนอร์)
const MINOR_KEY_CHORDS: Record<string, string[]> = {
    Am: ["Am", "Bdim", "C", "Dm", "Em", "F", "G", "Am7", "E7", "G7", "Fmaj7"],
    "A#m": ["A#m", "Cdim", "C#", "D#m", "Fm", "F#", "G#", "A#m7", "F7", "G#7", "F#maj7"],
    Bm: ["Bm", "C#dim", "D", "Em", "F#m", "G", "A", "Bm7", "F#7", "A7", "Gmaj7"],
    Cm: ["Cm", "Ddim", "D#", "Fm", "Gm", "G#", "A#", "Cm7", "G7", "A#7", "G#maj7"],
    "C#m": ["C#m", "D#dim", "E", "F#m", "G#m", "A", "B", "C#m7", "G#7", "B7", "Amaj7"],
    Dm: ["Dm", "Edim", "F", "Gm", "Am", "A#", "C", "Dm7", "A7", "C7", "A#maj7"],
    "D#m": ["D#m", "Fdim", "F#", "G#m", "A#m", "B", "C#", "D#m7", "A#7", "C#7", "Bmaj7"],
    Em: ["Em", "F#dim", "G", "Am", "Bm", "C", "D", "Em7", "B7", "D7", "Cmaj7"],
    Fm: ["Fm", "Gdim", "G#", "A#m", "Cm", "C#", "D#", "Fm7", "C7", "D#7", "C#maj7"],
    "F#m": ["F#m", "G#dim", "A", "Bm", "C#m", "D", "E", "F#m7", "C#7", "E7", "Dmaj7"],
    Gm: ["Gm", "Adim", "A#", "Cm", "Dm", "D#", "F", "Gm7", "D7", "F7", "D#maj7"],
    "G#m": ["G#m", "A#dim", "B", "C#m", "D#m", "E", "F#", "G#m7", "D#7", "F#7", "Emaj7"],
}

// ฟังก์ชันสำหรับแปลงคอร์ดให้เป็นรูปแบบมาตรฐาน
function normalizeChord(chord: string): string {
    // ลบวงเล็บออก
    chord = chord.replace(/[[\]]/g, "").trim()

    // แปลงคอร์ดให้เป็นรูปแบบมาตรฐาน
    return chord
}

// ฟังก์ชันสำหรับแยกคอร์ดจากข้อความ
function extractChords(input: string): string[] {
    // แยกคอร์ดจากข้อความ
    const chordPattern = /\[([^\]]+)\]|([A-G][#b]?(?:m|maj|dim|aug|sus|add|[0-9])*)/g
    const matches = input.match(chordPattern) || []

    // แปลงคอร์ดให้เป็นรูปแบบมาตรฐาน
    return matches.map(normalizeChord).filter(Boolean)
}

// ฟังก์ชันสำหรับวิเคราะห์คีย์จากคอร์ด
export function analyzeKey(input: string): KeyAnalysisResult {
    // แยกคอร์ดจากข้อความ
    const chords = extractChords(input)

    if (chords.length === 0) {
        return {
            possibleKeys: [],
            detectedChords: [],
            confidence: 0,
        }
    }

    // นับจำนวนคอร์ดที่ปรากฏ
    const chordCounts: Record<string, number> = {}
    chords.forEach((chord) => {
        const baseChord = chord.replace(/[0-9]|maj|dim|aug|sus|add/g, "")
        chordCounts[baseChord] = (chordCounts[baseChord] || 0) + 1
    })

    // คำนวณคะแนนความเป็นไปได้สำหรับแต่ละคีย์
    const keyScores: Array<{
        key: string
        scale: "major" | "minor"
        score: number
    }> = []

    // ตรวจสอบคีย์เมเจอร์
    Object.entries(MAJOR_KEY_CHORDS).forEach(([key, commonChords]) => {
        let score = 0
        let matchCount = 0

        // ให้คะแนนตามจำนวนคอร์ดที่ตรงกับคีย์
        Object.keys(chordCounts).forEach((chord) => {
            if (commonChords.includes(chord)) {
                score += chordCounts[chord]
                matchCount++
            }
        })

        // ให้คะแนนพิเศษสำหรับคอร์ดหลักของคีย์
        if (chordCounts[key]) {
            score += chordCounts[key] * 2
        }

        // ให้คะแนนพิเศษถ้าคอร์ดสุดท้ายเป็นคอร์ดของคีย์
        const lastChord = normalizeChord(chords[chords.length - 1])
        if (lastChord === key) {
            score += 5
        }

        keyScores.push({ key, scale: "major", score })
    })

    // ตรวจสอบคีย์ไมเนอร์
    Object.entries(MINOR_KEY_CHORDS).forEach(([key, commonChords]) => {
        let score = 0
        let matchCount = 0

        // ให้คะแนนตามจำนวนคอร์ดที่ตรงกับคีย์
        Object.keys(chordCounts).forEach((chord) => {
            if (commonChords.includes(chord)) {
                score += chordCounts[chord]
                matchCount++
            }
        })

        // ให้คะแนนพิเศษสำหรับคอร์ดหลักของคีย์
        if (chordCounts[key]) {
            score += chordCounts[key] * 2
        }

        // ให้คะแนนพิเศษถ้าคอร์ดสุดท้ายเป็นคอร์ดของคีย์
        const lastChord = normalizeChord(chords[chords.length - 1])
        if (lastChord === key) {
            score += 5
        }

        keyScores.push({ key, scale: "minor", score })
    })

    // เรียงลำดับคีย์ตามคะแนน
    keyScores.sort((a, b) => b.score - a.score)

    // คำนวณความมั่นใจในผลลัพธ์
    let confidence = 50 // ค่าเริ่มต้น

    // ถ้ามีคีย์ที่มีคะแนนสูงกว่าคีย์อื่นอย่างชัดเจน
    if (keyScores.length >= 2) {
        const scoreDiff = keyScores[0].score - keyScores[1].score
        if (scoreDiff > 10) {
            confidence += 30
        } else if (scoreDiff > 5) {
            confidence += 20
        } else if (scoreDiff > 2) {
            confidence += 10
        }
    }

    // ถ้ามีคอร์ดน้อยเกินไป ความมั่นใจจะลดลง
    if (chords.length < 4) {
        confidence -= 20
    } else if (chords.length < 8) {
        confidence -= 10
    }

    // จำกัดความมั่นใจไม่ให้เกิน 100 หรือต่ำกว่า 0
    confidence = Math.min(100, Math.max(0, confidence))

    // สร้างผลลัพธ์
    return {
        possibleKeys: keyScores.slice(0, 3).map(({ key, scale }) => ({ key, scale })),
        detectedChords: [...new Set(chords)],
        confidence,
    }
}
