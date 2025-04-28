import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DiscipleBasicInfo from "@/components/disciple-basic-info"
import TimeSpentTracker from "@/components/time-spent-tracker"
import SpiritualGrowthTracker from "@/components/spiritual-growth-tracker"
import FollowUpPlanner from "@/components/follow-up-planner"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">SeedTrack: Disciple Growth Tracking</h1>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info">ข้อมูลพื้นฐาน</TabsTrigger>
          <TabsTrigger value="time-spent">การใช้เวลา</TabsTrigger>
          <TabsTrigger value="spiritual-growth">การเติบโตฝ่ายวิญญาณ</TabsTrigger>
          <TabsTrigger value="follow-up">การติดตาม</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลพื้นฐานของลูกแกะ</CardTitle>
              <CardDescription>กรอกข้อมูลพื้นฐานของลูกแกะที่คุณกำลังติดตามดูแล</CardDescription>
            </CardHeader>
            <CardContent>
              <DiscipleBasicInfo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time-spent">
          <Card>
            <CardHeader>
              <CardTitle>📅 การใช้เวลา & การนัดพบ</CardTitle>
              <CardDescription>บันทึกการใช้เวลาและการนัดพบกับลูกแกะ</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeSpentTracker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spiritual-growth">
          <Card>
            <CardHeader>
              <CardTitle>📈 การเติบโตฝ่ายวิญญาณ</CardTitle>
              <CardDescription>ติดตามการเติบโตฝ่ายวิญญาณของลูกแกะ</CardDescription>
            </CardHeader>
            <CardContent>
              <SpiritualGrowthTracker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="follow-up">
          <Card>
            <CardHeader>
              <CardTitle>🔁 การติดตาม & แผนต่อไป</CardTitle>
              <CardDescription>วางแผนการติดตามและกำหนดการพบครั้งต่อไป</CardDescription>
            </CardHeader>
            <CardContent>
              <FollowUpPlanner />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
