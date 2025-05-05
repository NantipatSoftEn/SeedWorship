"use client"

import { useState, useRef, JSX } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, FileText, Info } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Textarea } from "@/components/shadcn/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/shadcn/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import { ChordExample } from "@/components/shadcn/chord-example"
import { LyricsPreview } from "@/components/shadcn/lyrics-preview"
import { ChordConverter } from "@/components/shadcn/chord-converter"
import { ChordDetector } from "@/components/shadcn/chord-detector"
import { TagSelector } from "@/components/shadcn/tag-selector"
import { SongKeyManager } from "@/components/shadcn/song-key-manager"
import { useToast } from "@/hooks/use-toast"
import { autoConvertChordFormat } from "@/utils/chord-formatter"
import { getAllKeys } from "@/utils/chord-transposer"
import type { Song, SongTag } from "@/types/song"

// Define the form schema with validation
const formSchema = z.object({
    title: z.string().min(1, "กรุณาระบุชื่อเพลง"),
    artist: z.string().min(1, "กรุณาระบุชื่อศิลปิน/วง"),
    category: z.enum(["praise", "worship", "opening"], {
        required_error: "กรุณาเลือกหมวดหมู่",
    }),
    language: z.enum(["thai", "english", "other"], {
        required_error: "กรุณาเลือกภาษา",
    }),
    tags: z.array(z.string()).optional(),
    lyrics: z.string().min(1, "กรุณาระบุเนื้อเพลง"),
})

type FormValues = z.infer<typeof formSchema>

interface EditSongFormProps {
    song: Song
    isOpen: boolean
    onClose: () => void
    onUpdateSong?: (song: Song) => void
}

export const EditSongForm = ({
    song,
    isOpen,
    onClose,
    onUpdateSong,
}: EditSongFormProps): JSX.Element => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false)
    const { toast } = useToast()
    const lyricsTextareaRef = useRef<HTMLTextAreaElement>(null)
    const allKeys = getAllKeys()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: song.title,
            artist: song.artist,
            category: song.category as "praise" | "worship" | "opening",
            language: song.language || "thai", // ใช้ค่าที่มีอยู่หรือค่าเริ่มต้นเป็นภาษาไทย
            tags: song.tags || [], // ใช้ค่าที่มีอยู่หรือค่าเริ่มต้นเป็นอาร์เรย์ว่าง
            lyrics: song.lyrics,
        },
    })

    // ในส่วนของการอัปเดตเพลง ให้รักษาค่า showChords และ createdAt
    const onSubmit = async (values: FormValues): Promise<void> => {
        setIsSubmitting(true)

        try {
            // ตรวจสอบและแปลงรูปแบบคอร์ดโดยอัตโนมัติ
            const formattedLyrics = autoConvertChordFormat(values.lyrics)

            // In a real application, you would send this data to your API
            // For now, we'll simulate a network request
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Create an updated song object
            const updatedSong: Song = {
                ...song,
                title: values.title,
                artist: values.artist,
                category: values.category,
                language: values.language, // อัปเดตภาษา
                tags: values.tags as SongTag[], // อัปเดต tags
                lyrics: formattedLyrics, // ใช้เนื้อเพลงที่แปลงรูปแบบคอร์ดแล้ว
                show_chords: song.show_chords ?? true, // รักษาค่าเดิม หรือตั้งค่าเริ่มต้นเป็น true
                created_at: song.created_at, // รักษาวันที่เพิ่มเพลงเดิมไว้
            }

            console.log("Song updated:", updatedSong)

            // Call the onUpdateSong callback if provided
            if (onUpdateSong) {
                onUpdateSong(updatedSong)
            }

            // Show success message
            toast({
                title: "แก้ไขเพลงสำเร็จ",
                description: `แก้ไขเพลง "${values.title}" เรียบร้อยแล้ว`,
            })

            // Close modal
            onClose()
        } catch (error) {
            console.error("Error updating song:", error)
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถแก้ไขเพลงได้ กรุณาลองใหม่อีกครั้ง",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = (): void => {
        form.reset({
            title: song.title,
            artist: song.artist,
            category: song.category as "praise" | "worship" | "opening",
            language: song.language || "thai",
            tags: song.tags || [],
            lyrics: song.lyrics,
        })
        onClose()
    }

    // ฟังก์ชันสำหรับนำเนื้อเพลงที่แปลงรูปแบบคอร์ดแล้วมาใช้
    const handleApplyConvertedLyrics = (convertedLyrics: string): void => {
        form.setValue("lyrics", convertedLyrics, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    // ฟังก์ชันสำหรับเปลี่ยนคีย์
    const handleKeyChange = (newKey: string): void => {
        // ไม่ต้องใช้ฟังก์ชันนี้แล้ว เพราะเราใช้ SongKeyManager แทน
    }

    const lyrics = form.watch("lyrics")
    const selectedLanguage = form.watch("language")
    const selectedTags = form.watch("tags") || []

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-300">
                            แก้ไขเพลง
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            onClick={handleClose}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">ปิด</span>
                        </Button>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-blue-900 dark:text-blue-300">
                                                ชื่อเพลง
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ระบุชื่อเพลง"
                                                    {...field}
                                                    className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 dark:text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="artist"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-blue-900 dark:text-blue-300">
                                                ศิลปิน/วง
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ระบุชื่อศิลปินหรือวง"
                                                    {...field}
                                                    className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 dark:text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-blue-900 dark:text-blue-300">
                                                หมวดหมู่
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                                        <SelectValue placeholder="เลือกหมวดหมู่" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                                                    <SelectItem
                                                        value="praise"
                                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                                    >
                                                        สรรเสริญ
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="worship"
                                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                                    >
                                                        นมัสการ
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="opening"
                                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                                    >
                                                        บทเพลงเปิด
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-red-500 dark:text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-blue-900 dark:text-blue-300">
                                                ภาษา
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                                        <SelectValue placeholder="เลือกภาษา" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                                                    <SelectItem
                                                        value="thai"
                                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                                    >
                                                        ภาษาไทย
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="english"
                                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                                    >
                                                        ภาษาอังกฤษ
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="other"
                                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                                    >
                                                        ภาษาอื่นๆ
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-red-500 dark:text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* เพิ่ม SongKeyManager */}
                            <div className="border border-blue-100 dark:border-blue-800 rounded-md p-4 bg-blue-50/50 dark:bg-blue-900/20">
                                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">
                                    จัดการคีย์เพลง
                                </h3>
                                <SongKeyManager songId={song.id} />
                            </div>

                            {/* เปลี่ยนจาก MultiSelect เป็น TagSelector */}
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TagSelector
                                                selectedTags={(field.value as SongTag[]) || []}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

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
                                                placeholder={
                                                    selectedLanguage === "english"
                                                        ? "Enter lyrics here..."
                                                        : "ระบุเนื้อเพลง"
                                                }
                                                {...field}
                                                ref={(e) => {
                                                    // Merge the refs
                                                    lyricsTextareaRef.current = e
                                                    if (typeof field.ref === "function") {
                                                        field.ref(e)
                                                    }
                                                }}
                                                className="min-h-[150px] border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-sarabun"
                                            />
                                        </FormControl>

                                        {/* เพิ่มส่วนแสดงคอร์ดที่ตรวจพบ */}
                                        {lyrics && (
                                            <ChordDetector
                                                lyrics={lyrics}
                                                currentKey=""
                                                onKeyChange={() => {}}
                                                className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md"
                                            />
                                        )}

                                        <ChordExample className="mt-2" />
                                        {lyrics && (
                                            <LyricsPreview lyrics={lyrics} className="mt-4" />
                                        )}
                                        <FormMessage className="text-red-500 dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md border border-amber-100 dark:border-amber-800/50">
                                <div className="flex items-start gap-2">
                                    <Info className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-amber-700 dark:text-amber-400">
                                        <p className="font-medium mb-1">คำแนะนำในการแก้ไขคอร์ด:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>เพิ่มคอร์ดในวงเล็บเหลี่ยม เช่น [C], [G], [Am]</li>
                                            <li>วางคอร์ดไว้ก่อนคำที่ต้องการให้เล่นคอร์ดนั้น</li>
                                            <li>ระบบจะวิเคราะห์คีย์เพลงจากคอร์ดที่คุณใส่</li>
                                            <li>
                                                คุณสามารถเพิ่มคีย์ได้หลายคีย์
                                                และเลือกคีย์หลักที่ต้องการ
                                            </li>
                                            <li>
                                                คอร์ดจะถูกปรับอัตโนมัติเมื่อเปลี่ยนคีย์ตอนแสดงผล
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    className="border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                                >
                                    ยกเลิก
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                                >
                                    {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <ChordConverter
                isOpen={isConverterOpen}
                onClose={() => setIsConverterOpen(false)}
                onApply={handleApplyConvertedLyrics}
            />
        </>
    )
}
