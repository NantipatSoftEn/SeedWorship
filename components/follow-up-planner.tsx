"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface FollowUpEntry {
  id: string
  nextMeetingDate: Date
  prayerRequests: string
  pendingQuestions: string
  specificNeeds: string
  needType: string
}

export default function FollowUpPlanner() {
  const [nextMeetingDate, setNextMeetingDate] = useState<Date>()
  const [followUpEntries, setFollowUpEntries] = useState<FollowUpEntry[]>([
    {
      id: "1",
      nextMeetingDate: new Date(2023, 4, 12), // May 12, 2023
      prayerRequests: "ขอพระเจ้าทรงนำในการตัดสินใจเรื่องการเรียนต่อ และการเติบโตในความเชื่อ",
      pendingQuestions: "ทำไมพระเจ้าจึงอนุญาตให้มีความทุกข์ในโลก?",
      specificNeeds: "กำลังเผชิญกับความกดดันจากเพื่อนที่ไม่เข้าใจความเชื่อใหม่",
      needType: "relationship",
    },
    {
      id: "2",
      nextMeetingDate: new Date(2023, 4, 19), // May 19, 2023
      prayerRequests: "ขอพระเจ้าทรงเยียวยาความสัมพันธ์ในครอบครัว และให้มีโอกาสแบ่งปันความเชื่อกับครอบครัว",
      pendingQuestions: "จะอธิบายเรื่องพระเจ้ากับครอบครัวที่ไม่เชื่ออย่างไร?",
      specificNeeds: "ต้องการคำแนะนำในการจัดการกับความเครียดและความวิตกกังวล",
      needType: "mental",
    },
  ])
  const [prayerRequests, setPrayerRequests] = useState("")
  const [pendingQuestions, setPendingQuestions] = useState("")
  const [specificNeeds, setSpecificNeeds] = useState("")
  const [needType, setNeedType] = useState("")
  const { toast } = useToast()

  const addFollowUpEntry = () => {
    if (!nextMeetingDate) return

    const newEntry: FollowUpEntry = {
      id: Date.now().toString(),
      nextMeetingDate,
      prayerRequests,
      pendingQuestions,
      specificNeeds,
      needType,
    }

    setFollowUpEntries([newEntry, ...followUpEntries]) // Add to the beginning of the array

    // Show confirmation message with toast
    toast({
      title: "บันทึกสำเร็จ",
      description: "เพิ่มแผนการติดตามเรียบร้อยแล้ว",
      variant: "success",
    })

    // Reset form
    setNextMeetingDate(undefined)
    setPrayerRequests("")
    setPendingQuestions("")
    setSpecificNeeds("")
    setNeedType("")
  }

  const deleteFollowUpEntry = (id: string) => {
    setFollowUpEntries(followUpEntries.filter((entry) => entry.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>กำหนดการพบครั้งต่อไป</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !nextMeetingDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {nextMeetingDate ? format(nextMeetingDate, "PPP", { locale: th }) : "เลือกวันที่นัดพบครั้งต่อไป"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={nextMeetingDate} onSelect={setNextMeetingDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prayerRequests">สิ่งที่ต้องอธิษฐานเผื่อ</Label>
          <Textarea
            id="prayerRequests"
            placeholder="บันทึกสิ่งที่ต้องอธิษฐานเผื่อลูกแกะ"
            rows={3}
            value={prayerRequests}
            onChange={(e) => setPrayerRequests(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pendingQuestions">คำถามที่ยังค้างคา</Label>
          <Textarea
            id="pendingQuestions"
            placeholder="บันทึกคำถามที่ยังไม่ได้รับคำตอบหรือต้องการติดตามต่อ"
            rows={3}
            value={pendingQuestions}
            onChange={(e) => setPendingQuestions(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="needType">ประเภทความต้องการช่วยเหลือ</Label>
            <Select value={needType} onValueChange={setNeedType}>
              <SelectTrigger id="needType">
                <SelectValue placeholder="เลือกประเภทความต้องการ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mental">จิตใจ</SelectItem>
                <SelectItem value="financial">การเงิน</SelectItem>
                <SelectItem value="relationship">ความสัมพันธ์</SelectItem>
                <SelectItem value="spiritual">ฝ่ายวิญญาณ</SelectItem>
                <SelectItem value="physical">สุขภาพร่างกาย</SelectItem>
                <SelectItem value="other">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificNeeds">รายละเอียดความต้องการช่วยเหลือ</Label>
            <Textarea
              id="specificNeeds"
              placeholder="อธิบายรายละเอียดความต้องการช่วยเหลือ"
              rows={3}
              value={specificNeeds}
              onChange={(e) => setSpecificNeeds(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={addFollowUpEntry} className="w-full" disabled={!nextMeetingDate}>
          <Plus className="mr-2 h-4 w-4" /> เพิ่มแผนการติดตาม
        </Button>
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-medium">แผนการติดตามที่บันทึกไว้</h3>

        {followUpEntries.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">ยังไม่มีการบันทึกแผนการติดตาม</p>
        ) : (
          <div className="space-y-4">
            {followUpEntries.map((entry) => (
              <Card key={entry.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => deleteFollowUpEntry(entry.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">
                        วันที่นัดพบครั้งต่อไป: {format(entry.nextMeetingDate, "PPP", { locale: th })}
                      </p>
                      <p className="mt-2 font-medium">สิ่งที่ต้องอธิษฐานเผื่อ:</p>
                      <p className="text-sm">{entry.prayerRequests}</p>
                      <p className="mt-2 font-medium">คำถามที่ยังค้างคา:</p>
                      <p className="text-sm">{entry.pendingQuestions}</p>
                    </div>
                    <div>
                      <p className="font-medium">
                        ประเภทความต้องการช่วยเหลือ:{" "}
                        {entry.needType === "mental"
                          ? "จิตใจ"
                          : entry.needType === "financial"
                            ? "การเงิน"
                            : entry.needType === "relationship"
                              ? "ความสัมพันธ์"
                              : entry.needType === "spiritual"
                                ? "ฝ่ายวิญญาณ"
                                : entry.needType === "physical"
                                  ? "สุขภาพร่างกาย"
                                  : entry.needType === "other"
                                    ? "อื่นๆ"
                                    : entry.needType}
                      </p>
                      <p className="mt-2 font-medium">รายละเอียดความต้องการช่วยเหลือ:</p>
                      <p className="text-sm">{entry.specificNeeds}</p>
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
