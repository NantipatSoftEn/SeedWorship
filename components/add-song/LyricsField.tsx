"use client"

import { JSX, useRef, useState } from "react"
import { FileText, Info } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Textarea } from "@/components/shadcn/textarea"
import { ChordDetector } from "@/components/shadcn/chord-detector"
import { ChordExample } from "@/components/shadcn/chord-example"
import { LyricsPreview } from "@/components/shadcn/lyrics-preview"
import { ChordConverter } from "@/components/shadcn/chord-converter"
import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "./schema"

interface LyricsFieldProps {
    form: UseFormReturn<FormValues>
    onKeyChange: (newKey: string) => void
}

export const LyricsField = ({ form, onKeyChange }: LyricsFieldProps): JSX.Element => {
    const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false)
    const lyricsTextareaRef = useRef<HTMLTextAreaElement>(null)

    const handleApplyConvertedLyrics = (convertedLyrics: string): void => {
        form.setValue("lyrics", convertedLyrics, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    const lyrics = form.watch("lyrics")
    const selectedLanguage = form.watch("language")
    const selectedKey = form.watch("key") || "C"

    return (
        <>
            <FormField
                control={form.control}
                name="lyrics"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel className="text-blue-900 dark:text-blue-300">
                                เนื้อเพลง
                            </FormLabel>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsConverterOpen(true)}
                                    className="border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                                >
                                    <FileText className="h-4 w-4 mr-1" />
                                    แปลงรูปแบบคอร์ด
                                </Button>
                            </div>
                        </div>
                        <FormControl>
                            <Textarea
                                ref={lyricsTextareaRef}
                                placeholder={
                                    selectedLanguage === "english"
                                        ? "Enter lyrics here..."
                                        : "ระบุเนื้อเพลง"
                                }
                                {...field}
                                className="min-h-[150px] border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-sarabun"
                            />
                        </FormControl>

                        {/* เพิ่มส่วนแสดงคอร์ดที่ตรวจพบ */}
                        {lyrics && (
                            <ChordDetector
                                lyrics={lyrics}
                                currentKey={selectedKey}
                                onKeyChange={onKeyChange}
                                className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md"
                            />
                        )}

                        <ChordExample className="mt-2" />
                        {lyrics && <LyricsPreview lyrics={lyrics} className="mt-4" />}
                        <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                )}
            />

            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md border border-amber-100 dark:border-amber-800/50">
                <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-700 dark:text-amber-400">
                        <p className="font-medium mb-1">คำแนะนำในการเพิ่มคอร์ด:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>เพิ่มคอร์ดในวงเล็บเหลี่ยม เช่น [C], [G], [Am]</li>
                            <li>วางคอร์ดไว้ก่อนคำที่ต้องการให้เล่นคอร์ดนั้น</li>
                            <li>ระบบจะวิเคราะห์คีย์เพลงจากคอร์ดที่คุณใส่</li>
                            <li>คุณสามารถเพิ่มคีย์ได้หลายคีย์ และเลือกคีย์หลักที่ต้องการ</li>
                            <li>คอร์ดจะถูกปรับอัตโนมัติเมื่อเปลี่ยนคีย์ตอนแสดงผล</li>
                        </ul>
                    </div>
                </div>
            </div>

            <ChordConverter
                isOpen={isConverterOpen}
                onClose={() => setIsConverterOpen(false)}
                onApply={handleApplyConvertedLyrics}
            />
        </>
    )
}
