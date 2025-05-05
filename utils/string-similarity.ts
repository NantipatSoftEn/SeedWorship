/**
 * คำนวณระยะห่างของ Levenshtein ระหว่างสองข้อความ
 * ยิ่งค่าน้อย แสดงว่าข้อความคล้ายกันมาก
 */
export function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = []

    // เติมค่าเริ่มต้นให้กับแถวแรก
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i]
    }

    // เติมค่าเริ่มต้นให้กับคอลัมน์แรก
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j
    }

    // คำนวณค่าที่เหลือในตาราง
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1]
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // แทนที่
                    matrix[i][j - 1] + 1, // แทรก
                    matrix[i - 1][j] + 1 // ลบ
                )
            }
        }
    }

    return matrix[b.length][a.length]
}

/**
 * คำนวณความคล้ายคลึงของข้อความ โดยใช้ระยะห่างของ Levenshtein
 * ค่าที่ได้อยู่ระหว่าง 0 ถึง 1 โดย 1 คือเหมือนกันทั้งหมด
 */
export function stringSimilarity(a: string, b: string): number {
    const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase())
    const maxLength = Math.max(a.length, b.length)

    if (maxLength === 0) return 1.0 // ทั้งสองข้อความว่าง ถือว่าเหมือนกัน

    return 1.0 - distance / maxLength
}

/**
 * ค้นหาคำที่คล้ายกับคำที่กำหนด จากรายการคำทั้งหมด
 * คืนค่าเป็นอาร์เรย์ของคำที่คล้ายกัน เรียงลำดับตามความคล้ายคลึง
 */
export function findSimilarStrings(query: string, strings: string[], threshold = 0.5): string[] {
    if (!query) return []

    // กรองคำที่สั้นเกินไป
    const filteredStrings = strings.filter((str) => str.length >= 2)

    const results = filteredStrings
        .map((str) => ({
            string: str,
            similarity: stringSimilarity(query, str),
        }))
        .filter((result) => result.similarity > threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .map((result) => result.string)

    // ลบคำซ้ำ
    return [...new Set(results)]
}
