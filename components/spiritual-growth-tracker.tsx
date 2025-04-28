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
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface WeeklyGrowthEntry {
  id: string
  date: Date
  understandingLevel: number
  chapterStudied: string
  cellGroupAttendance: string
  churchAttendance: string
}

const BIBLE_STUDY_LESSONS = [
  "บทที่ 1: พระเจ้าคือใคร",
  "บทที่ 2: พระเยซูคริสต์",
  "บทที่ 3: พระวิญญาณบริสุทธิ์",
  "บทที่ 4: การอธิษฐาน",
  "บทที่ 5: พระคัมภีร์",
  "บทที่ 6: ความรอด",
  "บทที่ 7: การบัพติศมา",
  "บทที่ 8: คริสตจักร",
  "บทที่ 9: การเป็นสาวก",
  "บทที่ 10: การเป็นพยาน",
  "บทที่ 11: การถวาย",
  "บทที่ 12: การรับใช้",
  "บทที่ 13: การนมัสการ",
  "บทที่ 14: ความบาป",
  "บทที่ 15: การกลับใจใหม่",
  "บทที่ 16: ชีวิตที่บริสุทธิ์",
  "บทที่ 17: การทดลอง",
  "บทที่ 18: การเติบโตฝ่ายวิญญาณ",
]

export default function SpiritualGrowthTracker() {
  const [weeklyDate, setWeeklyDate] = useState<Date>()
  const [weeklyEntries, setWeeklyEntries] = useState<WeeklyGrowthEntry[]>([
    {
      id: "1",
      date: new Date(2023, 3, 16), // April 16, 2023
      understandingLevel: 4,
      chapterStudied: "ยอห์น 3:1-21",
      cellGroupAttendance: "attended",
      churchAttendance: "attended",
    },
    {
      id: "2",
      date: new Date(2023, 3, 23), // April 23, 2023
      understandingLevel: 5,
      chapterStudied: "โรม 6:15-23",
      cellGroupAttendance: "attended",
      churchAttendance: "online",
    },
    {
      id: "3",
      date: new Date(2023, 4, 7), // May 7, 2023
      understandingLevel: 6,
      chapterStudied: "เอเฟซัส 2:1-10",
      cellGroupAttendance: "absent",
      churchAttendance: "attended",
    },
  ])
  const [understandingLevel, setUnderstandingLevel] = useState<number>(5)
  const [chapterStudied, setChapterStudied] = useState("")
  const [cellGroupAttendance, setCellGroupAttendance] = useState("")
  const [churchAttendance, setChurchAttendance] = useState("")
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    "บทที่ 1: พระเจ้าคือใคร",
    "บทที่ 2: พระเยซูคริสต์",
    "บทที่ 3: พระวิญญาณบริสุทธิ์",
  ])
  const [ministryService, setMinistryService] = useState("")
  const [personalChanges, setPersonalChanges] = useState("")

  const { toast } = useToast()

  const addWeeklyEntry = () => {
    if (!weeklyDate) return

    const newEntry: WeeklyGrowthEntry = {
      id: Date.now().toString(),
      date: weeklyDate,
      understandingLevel,
      chapterStudied,
      cellGroupAttendance,
      churchAttendance,
    }

    setWeeklyEntries([newEntry, ...weeklyEntries]) // Add to the beginning of the array

    // Show confirmation message with toast
    toast({
      title: "บันทึกสำเร็จ",
      description: "เพิ่มบันทึกการเติบโตรายสัปดาห์เรียบร้อยแล้ว",
      variant: "success",
    })

    // Reset form
    setWeeklyDate(undefined)
    setUnderstandingLevel(5)
    setChapterStudied("")
    setCellGroupAttendance("")
    setChurchAttendance("")
  }

  const deleteWeeklyEntry = (id: string) => {
    setWeeklyEntries(weeklyEntries.filter((entry) => entry.id !== id))
  }

  const toggleLesson = (lesson: string) => {
    setCompletedLessons(
      completedLessons.includes(lesson) ? completedLessons.filter((l) => l !== lesson) : [...completedLessons, lesson],
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">บันทึกการเติบโตรายสัปดาห์</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>วันที่บันทึก</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !weeklyDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {weeklyDate ? format(weeklyDate, "PPP", { locale: th }) : "เลือกวันที่"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={weeklyDate} onSelect={setWeeklyDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chapterStudied">บทที่เรียน/ศึกษา</Label>
            <Input
              id="chapterStudied"
              placeholder="เช่น ยอห์น 3:16"
              value={chapterStudied}
              onChange={(e) => setChapterStudied(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>ระดับความเข้าใจในพระวจนะ (1-10)</Label>
          <div className="flex items-center space-x-4">
            <Slider
              value={[understandingLevel]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setUnderstandingLevel(value[0])}
              className="flex-1"
            />
            <span className="w-12 text-center font-medium">{understandingLevel}/10</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cellGroupAttendance">การเข้าร่วมกลุ่มเซลล์</Label>
            <Select value={cellGroupAttendance} onValueChange={setCellGroupAttendance}>
              <SelectTrigger id="cellGroupAttendance">
                <SelectValue placeholder="เลือกสถานะการเข้าร่วม" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attended">เข้าร่วม</SelectItem>
                <SelectItem value="absent">ไม่ได้เข้าร่วม</SelectItem>
                <SelectItem value="late">มาสาย</SelectItem>
                <SelectItem value="online">เข้าร่วมออนไลน์</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="churchAttendance">การเข้าร่วมคริสตจักร</Label>
            <Select value={churchAttendance} onValueChange={setChurchAttendance}>
              <SelectTrigger id="churchAttendance">
                <SelectValue placeholder="เลือกสถานะการเข้าร่วม" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attended">เข้าร่วม</SelectItem>
                <SelectItem value="absent">ไม่ได้เข้าร่วม</SelectItem>
                <SelectItem value="late">มาสาย</SelectItem>
                <SelectItem value="online">เข้าร่วมออนไลน์</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={addWeeklyEntry} className="w-full" disabled={!weeklyDate}>
          <Plus className="mr-2 h-4 w-4" /> เพิ่มบันทึกรายสัปดาห์
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">ประวัติการเติบโตรายสัปดาห์</h3>

        {weeklyEntries.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">ยังไม่มีการบันทึกการเติบโตรายสัปดาห์</p>
        ) : (
          <div className="space-y-4">
            {weeklyEntries.map((entry) => (
              <Card key={entry.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => deleteWeeklyEntry(entry.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">วันที่: {format(entry.date, "PPP", { locale: th })}</p>
                      <p>บทที่เรียน: {entry.chapterStudied}</p>
                      <p>ระดับความเข้าใจ: {entry.understandingLevel}/10</p>
                    </div>
                    <div>
                      <p>
                        การเข้าร่วมกลุ่มเซลล์:{" "}
                        {entry.cellGroupAttendance === "attended"
                          ? "เข้าร่วม"
                          : entry.cellGroupAttendance === "absent"
                            ? "ไม่ได้เข้าร่วม"
                            : entry.cellGroupAttendance === "late"
                              ? "มาสาย"
                              : entry.cellGroupAttendance === "online"
                                ? "เข้าร่วมออนไลน์"
                                : entry.cellGroupAttendance}
                      </p>
                      <p>
                        การเข้าร่วมคริสตจักร:{" "}
                        {entry.churchAttendance === "attended"
                          ? "เข้าร่วม"
                          : entry.churchAttendance === "absent"
                            ? "ไม่ได้เข้าร่วม"
                            : entry.churchAttendance === "late"
                              ? "มาสาย"
                              : entry.churchAttendance === "online"
                                ? "เข้าร่วมออนไลน์"
                                : entry.churchAttendance}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">บทเรียนที่ศึกษาแล้ว</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BIBLE_STUDY_LESSONS.map((lesson) => (
            <div key={lesson} className="flex items-center space-x-2">
              <Checkbox
                id={`lesson-${lesson}`}
                checked={completedLessons.includes(lesson)}
                onCheckedChange={() => toggleLesson(lesson)}
              />
              <Label
                htmlFor={`lesson-${lesson}`}
                className={cn(completedLessons.includes(lesson) && "line-through text-muted-foreground")}
              >
                {lesson}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">การเริ่มรับใช้ (ถ้ามี)</h3>
        <Textarea
          placeholder="เช่น เป็นผู้ช่วย, อธิษฐานหน้าเวที, ร้องเพลง ฯลฯ"
          value={ministryService}
          onChange={(e) => setMinistryService(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">ความเปลี่ยนแปลงในชีวิตส่วนตัว</h3>
        <Textarea
          placeholder="เช่น เลิกพฤติกรรมเก่า, กลับใจ ฯลฯ"
          value={personalChanges}
          onChange={(e) => setPersonalChanges(e.target.value)}
          rows={4}
        />
      </div>

      <Button className="w-full">บันทึกการเติบโตฝ่ายวิญญาณ</Button>
    </div>
  )
}
