"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/shadcn/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Song } from "@/types/song"

interface DeleteSongDialogProps {
    song: Song
    onDeleteSong: (songId: string) => void
}

export const DeleteSongDialog = ({ song, onDeleteSong }: DeleteSongDialogProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const { toast } = useToast()

    const handleDelete = async (): Promise<void> => {
        setIsDeleting(true)

        try {
            // In a real application, you would send a delete request to your API
            // For now, we'll simulate a network request
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Call the onDeleteSong callback
            onDeleteSong(song.id)

            // Show success message
            toast({
                title: "ลบเพลงสำเร็จ",
                description: `ลบเพลง "${song.title}" เรียบร้อยแล้ว`,
            })

            // Close the dialog
            setIsOpen(false)
        } catch (error) {
            console.error("Error deleting song:", error)
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถลบเพลงได้ กรุณาลองใหม่อีกครั้ง",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => setIsOpen(true)}
                aria-label="ลบเพลง"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold text-blue-900">
                            ยืนยันการลบเพลง
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                            คุณต้องการลบเพลง <span className="font-medium">"{song.title}"</span>{" "}
                            ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-blue-200 text-blue-800">
                            ยกเลิก
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "กำลังลบ..." : "ลบเพลง"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
