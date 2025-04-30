"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile } from "@/lib/actions/user-actions"
import type { UserProfile } from "@/types/user"

// สร้าง schema สำหรับการตรวจสอบข้อมูล
const profileFormSchema = z.object({
  username: z.string().min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"),
  display_name: z.string().min(1, "กรุณาระบุชื่อที่แสดง"),
  avatar_url: z.string().url("กรุณาระบุ URL ที่ถูกต้อง").optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface UserProfileFormProps {
  profile: UserProfile | null
}

export function UserProfileForm({ profile }: UserProfileFormProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile?.username || "",
      display_name: profile?.display_name || "",
      avatar_url: profile?.avatar_url || "",
    },
  })

  const onSubmit = async (values: ProfileFormValues): Promise<void> => {
    setIsSubmitting(true)

    try {
      const result = await updateUserProfile(values)

      if (result.success) {
        toast({
          title: "อัปเดตโปรไฟล์สำเร็จ",
          description: result.message,
        })
      } else {
        toast({
          title: "อัปเดตโปรไฟล์ไม่สำเร็จ",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อผู้ใช้</FormLabel>
              <FormControl>
                <Input placeholder="ชื่อผู้ใช้ของคุณ" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อที่แสดง</FormLabel>
              <FormControl>
                <Input placeholder="ชื่อที่แสดงของคุณ" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL รูปโปรไฟล์</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  disabled={isSubmitting}
                  {...field}
                  defaultValue={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </Button>
      </form>
    </Form>
  )
}
