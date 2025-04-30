import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserProfileForm } from "@/components/profile/user-profile-form"
import { UserSongList } from "@/components/profile/user-song-list"
import { UserFavoritesList } from "@/components/profile/user-favorites-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"

export default async function ProfilePage() {
  const supabase = createClient()
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
    <main className="container mx-auto px-4 py-6 min-h-screen bg-cream-50 dark:bg-gray-900">
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-800 dark:text-blue-300 mb-6">โปรไฟล์ของฉัน</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-blue-50 dark:border-blue-900">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4">ข้อมูลส่วนตัว</h2>
            <UserProfileForm profile={profile} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-blue-50 dark:border-blue-900">
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
