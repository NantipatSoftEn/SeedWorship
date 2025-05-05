// คอร์ดทั้งหมดที่รองรับ
const CHORDS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// คอร์ดที่มีชื่อเรียกได้หลายแบบ (enharmonic equivalents)
const CHORD_ALIASES: Record<string, string> = {
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
}

// คอร์ดที่มีชื่อเรียกได้หลายแบบในทางกลับกัน
const REVERSE_CHORD_ALIASES: Record<string, string> = {
    "C#": "Db",
    "D#": "Eb",
    "F#": "Gb",
    "G#": "Ab",
    "A#": "Bb",
}

/**
 * แปลงคอร์ดให้เป็นรูปแบบมาตรฐาน (เช่น Db เป็น C#)
 */
export function normalizeChord(chord: string): string {
    // ตรวจสอบว่าคอร์ดมีรูปแบบมาตรฐานหรือไม่
    const rootPattern = /^([A-G][b#]?)(.*)$/
    const match = chord.match(rootPattern)

    if (!match) return chord // ถ้าไม่ใช่คอร์ด ให้คืนค่าเดิม

    const [, root, suffix] = match
    const normalizedRoot = CHORD_ALIASES[root] || root

    return normalizedRoot + suffix
}

/**
 * หาดัชนีของคอร์ดในอาร์เรย์ CHORDS
 */
function getChordIndex(chord: string): number {
    const normalizedChord = normalizeChord(chord)
    return CHORDS.indexOf(normalizedChord)
}

/**
 * เปลี่ยนคอร์ดตามจำนวนขั้นที่ต้องการ
 */
function transposeChord(chord: string, semitones: number): string {
    // ตรวจสอบว่าคอร์ดมีรูปแบบมาตรฐานหรือไม่
    const rootPattern = /^([A-G][b#]?)(.*)$/
    const match = chord.match(rootPattern)

    if (!match) return chord // ถ้าไม่ใช่คอร์ด ให้คืนค่าเดิม

    const [, root, suffix] = match
    const normalizedRoot = CHORD_ALIASES[root] || root

    // หาดัชนีของคอร์ดในอาร์เรย์ CHORDS
    const index = getChordIndex(normalizedRoot)

    if (index === -1) return chord // ถ้าไม่พบคอร์ด ให้คืนค่าเดิม

    // คำนวณดัชนีใหม่หลังจากเปลี่ยนคีย์
    const newIndex = (index + semitones + CHORDS.length) % CHORDS.length
    const newRoot = CHORDS[newIndex]

    // ถ้าคอร์ดเดิมใช้ flat (b) แทน sharp (#) ให้ใช้ flat ในคอร์ดใหม่ด้วย
    let finalRoot = newRoot
    if (root.includes("b") && REVERSE_CHORD_ALIASES[newRoot]) {
        finalRoot = REVERSE_CHORD_ALIASES[newRoot]
    }

    return finalRoot + suffix
}

/**
 * เปลี่ยนคีย์ของเพลงจากคีย์หนึ่งไปอีกคีย์หนึ่ง
 */
export function transposeSong(lyrics: string, fromKey: string, toKey: string): string {
    // ถ้าคีย์เดิมและคีย์ใหม่เหมือนกัน ไม่ต้องเปลี่ยน
    if (normalizeChord(fromKey) === normalizeChord(toKey)) return lyrics

    // คำนวณจำนวนขั้นที่ต้องเปลี่ยน
    const fromIndex = getChordIndex(normalizeChord(fromKey))
    const toIndex = getChordIndex(normalizeChord(toKey))

    if (fromIndex === -1 || toIndex === -1) return lyrics // ถ้าคีย์ไม่ถูกต้อง ให้คืนค่าเดิม

    const semitones = toIndex - fromIndex

    // แทนที่คอร์ดทั้งหมดในเนื้อเพลง
    return lyrics.replace(/\[([A-G][b#]?[^[\]]*)\]/g, (match, chord) => {
        // แยกคอร์ดออกเป็นส่วนๆ ในกรณีที่มีหลายคอร์ดในวงเล็บเดียว เช่น [C/G]
        const chordParts = chord.split("/")
        const transposedParts = chordParts.map((part) => {
            // แยกคอร์ดหลักและส่วนเสริม เช่น Cmaj7 เป็น C และ maj7
            const chordMatch = part.match(/^([A-G][b#]?)(.*)$/)
            if (chordMatch) {
                const [, root, suffix] = chordMatch
                return transposeChord(root + suffix, semitones)
            }
            return part
        })

        return "[" + transposedParts.join("/") + "]"
    })
}

/**
 * สร้างรายการตัวเลือกคีย์ทั้งหมด
 */
export function getAllKeys(): string[] {
    // รวมคีย์ทั้งหมดทั้งแบบ sharp และ flat
    const allKeys = [...CHORDS]

    // เพิ่มคีย์แบบ flat
    Object.keys(REVERSE_CHORD_ALIASES).forEach((sharp) => {
        const flat = REVERSE_CHORD_ALIASES[sharp]
        if (!allKeys.includes(flat)) {
            allKeys.push(flat)
        }
    })

    // เรียงลำดับคีย์ตามวงจรคู่ 5 (Circle of Fifths)
    const circleOfFifths = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"]

    return circleOfFifths
}
