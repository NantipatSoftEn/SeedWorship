"use client"

import { useState } from "react"
import { analyzeKey } from "@/components/key-analyzer/utils/analyze-key"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Music, Info } from "lucide-react"
import type { KeyAnalysisResult } from "@/components/key-analyzer/types/key-analysis"

export function KeyAnalyzerForm() {
    const [chordInput, setChordInput] = useState("")
    const [result, setResult] = useState<KeyAnalysisResult | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handleAnalyze = () => {
        setIsAnalyzing(true)

        // Simulate a small delay to show loading state
        setTimeout(() => {
            const analysisResult = analyzeKey(chordInput)
            setResult(analysisResult)
            setIsAnalyzing(false)
        }, 500)
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>ป้อนคอร์ดเพลง</CardTitle>
                    <CardDescription>
                        ป้อนคอร์ดเพลงในรูปแบบ C G Am F หรือ [C] [G] [Am] [F]
                        แต่ละคอร์ดคั่นด้วยช่องว่างหรือขึ้นบรรทัดใหม่
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="ตัวอย่าง: C G Am F หรือ [C] [G] [Am] [F]"
                        value={chordInput}
                        onChange={(e) => setChordInput(e.target.value)}
                        rows={8}
                        className="font-mono"
                    />
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleAnalyze}
                        disabled={!chordInput.trim() || isAnalyzing}
                        className="w-full md:w-auto"
                    >
                        {isAnalyzing ? "กำลังวิเคราะห์..." : "วิเคราะห์คีย์"}
                    </Button>
                </CardFooter>
            </Card>

            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Music className="h-5 w-5" />
                            ผลการวิเคราะห์
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-1">
                            <div className="text-sm font-medium">คีย์ที่น่าจะเป็น:</div>
                            <div className="flex flex-wrap gap-2">
                                {result.possibleKeys.map((keyInfo, index) => (
                                    <div
                                        key={index}
                                        className={`px-4 py-2 rounded-md ${
                                            index === 0
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "bg-muted"
                                        }`}
                                    >
                                        {keyInfo.key} {keyInfo.scale === "minor" ? "minor" : ""}
                                        {index === 0 && " (มีความเป็นไปได้มากที่สุด)"}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-1">
                            <div className="text-sm font-medium">คอร์ดที่พบ:</div>
                            <div className="flex flex-wrap gap-2">
                                {result.detectedChords.map((chord, index) => (
                                    <div key={index} className="px-2 py-1 bg-accent rounded">
                                        {chord}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {result.confidence < 70 && (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>หมายเหตุ</AlertTitle>
                                <AlertDescription>
                                    ความแม่นยำในการวิเคราะห์อยู่ในระดับ{" "}
                                    {result.confidence < 40 ? "ต่ำ" : "ปานกลาง"}{" "}
                                    คุณอาจต้องพิจารณาเพิ่มเติมหรือป้อนคอร์ดเพิ่ม
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>คำแนะนำในการป้อนคอร์ด</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <h3 className="font-medium">รูปแบบที่รองรับ:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>คอร์ดพื้นฐาน: C, D, E, F, G, A, B</li>
                            <li>คอร์ดชาร์ป: C#, D#, F#, G#, A#</li>
                            <li>คอร์ดไมเนอร์: Cm, Dm, Em, Fm, Gm, Am, Bm</li>
                            <li>คอร์ดเซเว่น: C7, D7, E7, F7, G7, A7, B7</li>
                            <li>
                                คอร์ดเมเจอร์เซเว่น: Cmaj7, Dmaj7, Emaj7, Fmaj7, Gmaj7, Amaj7, Bmaj7
                            </li>
                            <li>คอร์ดไมเนอร์เซเว่น: Cm7, Dm7, Em7, Fm7, Gm7, Am7, Bm7</li>
                        </ul>
                    </div>

                    <div className="grid gap-2">
                        <h3 className="font-medium">เคล็ดลับ:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>ยิ่งป้อนคอร์ดมาก ผลการวิเคราะห์จะยิ่งแม่นยำ</li>
                            <li>ป้อนคอร์ดตามลำดับที่ปรากฏในเพลง</li>
                            <li>คอร์ดสุดท้ายของเพลงมักจะเป็นคอร์ดของคีย์หลัก</li>
                            <li>
                                ระบบรองรับทั้งการป้อนคอร์ดแบบมีวงเล็บเช่น [C] และไม่มีวงเล็บเช่น C
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
