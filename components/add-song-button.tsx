"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { AddSongForm } from "@/components/add-song-form"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { AuthForm } from "@/components/shadcn/auth-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/shadcn/dialog"
import type { Song } from "@/types/song"

interface AddSongButtonProps {
  className?: string
  onAddSong?: (song: Song) => void
}

export const AddSongButton = ({ className, onAddSong }: AddSongButtonProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false)
  const { user, isLoading } = useAuth()

  const handleClick = () => {
    if (!isLoading && !user) {
      // ถ้าไม่มีผู้ใช้ที่ล็อกอินอยู่ ให้แสดงหน้าต่างล็อกอิน
      setIsAuthDialogOpen(true)
    } else {
      // ถ้ามีผู้ใช้ที่ล็อกอินอยู่ ให้แสดงฟอร์มเพิ่มเพลง
      setIsOpen(true)
    }
  }

  return (
    <>
      <Button
        id="add-song-button"
        className={className || "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"}
        onClick={handleClick}
      >
        <Plus className="h-4 w-4 mr-2" />
        เพิ่มเพลงใหม่
      </Button>

      <AddSongForm isOpen={isOpen} onClose={() => setIsOpen(false)} onAddSong={onAddSong} />

      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>เข้าสู่ระบบหรือลงทะเบียน</DialogTitle>
            <DialogDescription>กรุณาเข้าสู่ระบบหรือลงทะเบียนก่อนเพิ่มเพลงใหม่</DialogDescription>
          </DialogHeader>
          <AuthForm />
        </DialogContent>
      </Dialog>
    </>
  )
}
