"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/supabase/database.types"

// สร้าง schema สำหรับการตรวจสอบข้อมูล
const authFormSchema = z.object({
  email: z.string().email("กรุณาระบุอีเมลที่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
})

type AuthFormValues = z.infer<typeof authFormSchema>

interface AuthFormProps {
  className?: string
}

export function AuthForm({ className }: AuthFormProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: AuthFormValues): Promise<void> => {
    setIsLoading(true)

    try {
      if (authMode === "login") {
        // เข้าสู่ระบบ
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })

        if (error) {
          toast({
            title: "เข้าสู่ระบบไม่สำเร็จ",
            description: error.message,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับกลับมา!",
        })
      } else {
        // ลงทะเบียน
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) {
          toast({
            title: "ลงทะเบียนไม่สำเร็จ",
            description: error.message,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "ลงทะเบียนสำเร็จ",
          description: "กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันการลงทะเบียน",
        })
      }

      // รีเซ็ตฟอร์มและรีโหลดหน้า
      form.reset()
      router.refresh()
    } catch (error) {
      console.error("Authentication error:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <Tabs defaultValue="login" onValueChange={(value) => setAuthMode(value as "login" | "register")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">เข้าสู่ระบบ</TabsTrigger>
          <TabsTrigger value="register">ลงทะเบียน</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="รหัสผ่านของคุณ"
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "กำลังดำเนินการ..." : "เข้าสู่ระบบ"}
              </Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="register" className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="รหัสผ่านของคุณ"
                        type="password"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "กำลังดำเนินการ..." : "ลงทะเบียน"}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
