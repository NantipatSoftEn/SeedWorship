"use client"

import { JSX, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/shadcn/dialog"
import { Form } from "@/components/shadcn/form"
import { useToast } from "@/hooks/use-toast"
import { autoConvertChordFormat } from "@/utils/chord-formatter"
import { FormFields } from "./FormFields"
import { LyricsField } from "./LyricsField"
import { formSchema, FormValues, createSongFromFormValues } from "./schema"
import type { Song } from "@/types/song"

interface AddSongFormProps {
    isOpen: boolean
    onClose: () => void
    onAddSong?: (song: Song) => void
}

export const AddSongForm = ({ isOpen, onClose, onAddSong }: AddSongFormProps): JSX.Element => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [keysWithChords, setKeysWithChords] = useState<Record<string, string[]>>({})
    const { toast } = useToast()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            artist: "",
            category: undefined,
            language: "thai",
            key: "C",
            tags: [],
            lyrics: "",
        },
    })

    const onSubmit = async (values: FormValues): Promise<void> => {
        setIsSubmitting(true)

        try {
            // Format lyrics and convert chord format automatically
            const formattedLyrics = autoConvertChordFormat(values.lyrics)

            // Create a song object using the helper function
            const songWithBasicInfo = createSongFromFormValues(values, keysWithChords)

            // Update lyrics with formatted version
            const newSong: Song = {
                ...songWithBasicInfo,
                lyrics: formattedLyrics,
            }

            // Add a short delay to simulate network request
            await new Promise((resolve) => setTimeout(resolve, 500))

            if (onAddSong) {
                onAddSong(newSong)
            }

            toast({
                title: "เพิ่มเพลงสำเร็จ",
                description: `เพิ่มเพลง "${values.title}" เรียบร้อยแล้ว`,
            })

            form.reset()
            setKeysWithChords({})
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
        setKeysWithChords({})
        onClose()
    }

    const handleKeyChange = (newKey: string): void => {
        form.setValue("key", newKey, { shouldValidate: true, shouldDirty: true })
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-300">
                        เพิ่มเพลงใหม่
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
                        {/* Basic form fields */}
                        <FormFields form={form} />

                        {/* Lyrics field with related components */}
                        <LyricsField form={form} onKeyChange={handleKeyChange} />

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
    )
}
