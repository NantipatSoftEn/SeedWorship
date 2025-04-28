"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface MeetingEntry {
  id: string
  date: Date
  duration: string
  topics: string
  response: string
  lambFeedback: string
  leaderObservation: string
}

export default function TimeSpentTracker() {
  const [meetingDate, setMeetingDate] = useState<Date>()
  const [meetings, setMeetings] = useState<MeetingEntry[]>([
    {
      id: "1",
      date: new Date(2023, 3, 15), // April 15, 2023
      duration: "1 ชั่วโมง 30 นาที",
      topics: "ยอห์น 3:16 - พูดคุยเกี่ยวกับความรักของพระเจ้าและการเสียสละของพระเยซู",
      response: "ตั้งใจฟังและถามคำถามเกี่ยวกับความรอด",
      lambFeedback: "รู้สึกประทับใจกับความรักของพระเจ้า และอยากเรียนรู้เพิ่มเติม",
      leaderObservation: "มีความสนใจในพระคัมภีร์มาก และมีคำถามที่ลึกซึ้ง",
    },
    {
      id: "2",
      date: new Date(2023, 3, 22), // April 22, 2023
      duration: "2 ชั่วโมง",
      topics: "โรม 6:23 - พูดคุยเกี่ยวกับบาปและของประทานแห่งชีวิตนิรันดร์",
      response: "เริ่มเข้าใจเรื่องความบาปและผลของความบาป",
      lambFeedback: "รู้สึกกังวลเกี่ยวกับความบาปในชีวิต แต่มีความหวังในพระคริสต์",
      leaderObservation: "เริ่มเห็นการตระหนักถึงความบาปและความต้องการพระผู้ช่วย",
    },
    {
      id: "3",
      date: new Date(2023, 4, 5), // May 5, 2023
      duration: "1 ชั่วโมง",
      topics: "เอเฟซัส 2:8-9 - พูดคุยเกี่ยวกับความรอดโดยพระคุณผ่านทางความเชื่อ",
      response: "เข้าใจว่าความรอดเป็นของประทานจากพระเจ้า ไม่ใช่จากการกระทำ",
      lambFeedback: "รู้สึกโล่งใจที่ไม่ต้องทำดีเพื่อให้ได้รับความรอด",
      leaderObservation: "เริ่มเข้าใจหลักการพื้นฐานของพระกิตติคุณ",
    },
  ])
  const [duration, setDuration] = useState("")
  const [topics, setTopics] = useState("")
  const [response, setResponse] = useState("")
  const [lambFeedback, setLambFeedback] = useState("")
  const [leaderObservation, setLeaderObservation] = useState("")

  const { toast } = useToast()

  const addMeeting = () => {
    if (!meetingDate) return

    const newMeeting: MeetingEntry = {
      id: Date.now().toString(),
      date: meetingDate,
      duration,
      topics,
      response,
      lambFeedback,
      leaderObservation,
    }

    setMeetings([newMeeting, ...meetings]) // Add to the beginning of the array

    // Show confirmation message with toast
    toast({
      title: "บันทึกสำเร็จ",
      description: "เพิ่มการบันทึกเรียบร้อยแล้ว",
      variant: "success",
    })

    // Reset form
    setMeetingDate(undefined)
    setDuration("")
    setTopics("")
    setResponse("")
    setLambFeedback("")
    setLeaderObservation("")
  }

  const deleteMeeting = (id: string) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>วันที่พบกัน / พูดคุย</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !meetingDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {meetingDate ? format(meetingDate, "PPP", { locale: th }) : "เลือกวันที่พบกัน"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={meetingDate} onSelect={setMeetingDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">ระยะเวลา (ชั่วโมง/นาที)</Label>
          <Input
            id="duration"
            placeholder="เช่น 1 ชั่วโมง 30 นาที"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topics">หัวข้อที่พูดคุย/ข้อพระคัมภีร์ที่ศึกษา</Label>
        <Textarea
          id="topics"
          placeholder="อธิบายหัวข้อหรือข้อพระคัมภีร์ที่ได้ศึกษาร่วมกัน"
          rows={3}
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="response">การตอบสนองต่อการใช้เวลา</Label>
        <Textarea
          id="response"
          placeholder="อธิบายการตอบสนองของลูกแกะต่อการใช้เวลาร่วมกัน"
          rows={2}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="lambFeedback">ความรู้สึกหรือผลตอบรับจากลูกแกะ</Label>
          <Textarea
            id="lambFeedback"
            placeholder="บันทึกความรู้สึกหรือผลตอบรับจากลูกแกะ"
            rows={3}
            value={lambFeedback}
            onChange={(e) => setLambFeedback(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leaderObservation">ความประทับใจหรือข้อสังเกตจากผู้นำ</Label>
          <Textarea
            id="leaderObservation"
            placeholder="บันทึกความประทับใจหรือข้อสังเกตของคุณ"
            rows={3}
            value={leaderObservation}
            onChange={(e) => setLeaderObservation(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={addMeeting} className="w-full" disabled={!meetingDate}>
        <Plus className="mr-2 h-4 w-4" /> เพิ่มการบันทึก
      </Button>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-medium">ประวัติการพบกัน</h3>

        {meetings.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">ยังไม่มีการบันทึกการพบกัน</p>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => deleteMeeting(meeting.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">วันที่: {format(meeting.date, "PPP", { locale: th })}</p>
                      <p>ระยะเวลา: {meeting.duration}</p>
                      <p className="mt-2 font-medium">หัวข้อ:</p>
                      <p className="text-sm">{meeting.topics}</p>
                    </div>
                    <div>
                      <p className="font-medium">การตอบสนอง:</p>
                      <p className="text-sm">{meeting.response}</p>
                      <p className="mt-2 font-medium">ความรู้สึกจากลูกแกะ:</p>
                      <p className="text-sm">{meeting.lambFeedback}</p>
                      <p className="mt-2 font-medium">ข้อสังเกตจากผู้นำ:</p>
                      <p className="text-sm">{meeting.leaderObservation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
