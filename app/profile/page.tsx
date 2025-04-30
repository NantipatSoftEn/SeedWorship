import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { UserProfileForm } from "@/components/profile/user-profile-form"
import { UserSongList } from "@/components/profile/user-song-list"
import { UserFavoritesList } from "@/components/profile/user-favorites-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { ThemeToggle } from "@/components/shadcn/theme-toggle"

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ถ้าไม่มีผู้ใช้ที่ล็อกอินอยู่ ให้เปลี่ยนเส้นทางไปยังหน้าแรก
  if (!user) {
    redirect("/")
  }

  // ดึงข้อมูลโปรไฟล์ของผู้ใช้
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <main className="container mx-auto px-4 py-6 min-h-screen bg-background">
      <PageHeader title="โปรไฟล์ของฉัน" description="จัดการข้อมูลส่วนตัวและเพลงของคุณ" rightContent={<ThemeToggle />} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
            <h2 className="text-xl font-semibold text-primary mb-4">ข้อมูลส่วนตัว</h2>
            <UserProfileForm profile={profile} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
            <Tabs defaultValue="my-songs">
              <TabsList className="mb-4">
                <TabsTrigger value="my-songs">เพลงของฉัน</TabsTrigger>
                <TabsTrigger value="favorites">เพลงโปรด</TabsTrigger>
              </TabsList>
              <TabsContent value="my-songs">
                <UserSongList userId={user.id} />
              </TabsContent>
              <TabsContent value="favorites">
                <UserFavoritesList userId={user.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
