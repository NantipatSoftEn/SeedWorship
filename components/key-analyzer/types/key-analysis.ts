export interface KeyInfo {
    key: string
    scale: "major" | "minor"
}

export interface KeyAnalysisResult {
    possibleKeys: KeyInfo[]
    detectedChords: string[]
    confidence: number
}
