"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, FileText } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Textarea } from "@/components/shadcn/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shadcn/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { ChordExample } from "@/components/shadcn/chord-example"
import { LyricsPreview } from "@/components/shadcn/lyrics-preview"
import { ChordConverter } from "@/components/shadcn/chord-converter"
import { TagSelector } from "@/components/shadcn/tag-selector"
import { useToast } from "@/hooks/use-toast"
import { autoConvertChordFormat } from "@/utils/chord-formatter"
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

interface AddSongFormProps {
  isOpen: boolean
  onClose: () => void
  onAddSong?: (song: Song) => void
}

export const AddSongForm = ({ isOpen, onClose, onAddSong }: AddSongFormProps): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false)
  const { toast } = useToast()
  const lyricsTextareaRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "",
      category: undefined,
      language: "thai", // ค่าเริ่มต้นเป็นภาษาไทย
      tags: [],
      lyrics: "",
    },
  })

  const onSubmit = async (values: FormValues): Promise<void> => {
    setIsSubmitting(true)

    try {
      // ตรวจสอบและแปลงรูปแบบคอร์ดโดยอัตโนมัติ
      const formattedLyrics = autoConvertChordFormat(values.lyrics)

      // In a real application, you would send this data to your API
      // For now, we'll simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // สร้างวันที่ปัจจุบัน
      const now = new Date()
      const createdAt = now.toISOString()

      // Create a new song object with a unique ID
      const newSong: Song = {
        id: `song-${Date.now()}`, // Generate a unique ID
        title: values.title,
        artist: values.artist,
        category: values.category,
        language: values.language, // เพิ่มภาษา
        tags: values.tags as SongTag[], // เพิ่ม tags
        lyrics: formattedLyrics, // ใช้เนื้อเพลงที่แปลงรูปแบบคอร์ดแล้ว
        showChords: true, // เพิ่มค่าเริ่มต้นให้แสดงคอร์ด
        createdAt, // เพิ่มวันที่ที่เพิ่มเพลง
      }

      console.log("New song created:", newSong)

      // Call the onAddSong callback if provided
      if (onAddSong) {
        onAddSong(newSong)
      }

      // Show success message
      toast({
        title: "เพิ่มเพลงสำเร็จ",
        description: `เพิ่มเพลง "${values.title}" เรียบร้อยแล้ว`,
      })

      // Reset form and close modal
      form.reset()
      onClose()
    } catch (error) {
      console.error("Error adding song:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มเพลงได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = (): void => {
    form.reset()
    onClose()
  }

  // ฟังก์ชันสำหรับนำเนื้อเพลงที่แปลงรูปแบบคอร์ดแล้วมาใช้
  const handleApplyConvertedLyrics = (convertedLyrics: string): void => {
    form.setValue("lyrics", convertedLyrics, { shouldValidate: true, shouldDirty: true })
  }

  const lyrics = form.watch("lyrics")
  const selectedLanguage = form.watch("language")
  const selectedTags = form.watch("tags") || []

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-300">เพิ่มเพลงใหม่</DialogTitle>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-900 dark:text-blue-300">ชื่อเพลง</FormLabel>
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
                      <FormLabel className="text-blue-900 dark:text-blue-300">ศิลปิน/วง</FormLabel>
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
                      <FormLabel className="text-blue-900 dark:text-blue-300">หมวดหมู่</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <FormLabel className="text-blue-900 dark:text-blue-300">ภาษา</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              {/* เปลี่ยนจาก MultiSelect เป็น TagSelector */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TagSelector selectedTags={(field.value as SongTag[]) || []} onChange={field.onChange} />
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
                      <FormLabel className="text-blue-900 dark:text-blue-300">เนื้อเพลง</FormLabel>
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
                        {/* ลบปุ่มเพิ่มคอร์ด (ChordHelper) ออก */}
                      </div>
                    </div>
                    <FormControl>
                      <Textarea
                        ref={lyricsTextareaRef}
                        placeholder={selectedLanguage === "english" ? "Enter lyrics here..." : "ระบุเนื้อเพลง"}
                        {...field}
                        className="min-h-[150px] border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-sarabun"
                      />
                    </FormControl>
                    <ChordExample className="mt-2" />
                    {lyrics && <LyricsPreview lyrics={lyrics} className="mt-4" />}
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

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
