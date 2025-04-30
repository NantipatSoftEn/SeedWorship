"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { LogIn, LogOut, User } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/shadcn/dialog"
import { AuthForm } from "@/components/shadcn/auth-form"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/supabase/database.types"

interface AuthButtonProps {
  user: any | null
  className?: string
}

export function AuthButton({ user, className }: AuthButtonProps): JSX.Element {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  const handleSignOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "ออกจากระบบสำเร็จ",
        description: "คุณได้ออกจากระบบแล้ว",
      })
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span>โปรไฟล์</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>ออกจากระบบ</span>
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAuthDialogOpen(true)}
          className={`flex items-center gap-2 ${className}`}
        >
          <LogIn className="h-4 w-4" />
          <span>เข้าสู่ระบบ</span>
        </Button>
      )}

      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>เข้าสู่ระบบหรือลงทะเบียน</DialogTitle>
            <DialogDescription>เข้าสู่ระบบเพื่อจัดการเพลงของคุณและใช้งานฟีเจอร์เพิ่มเติม</DialogDescription>
          </DialogHeader>
          <AuthForm />
        </DialogContent>
      </Dialog>
    </>
  )
}
