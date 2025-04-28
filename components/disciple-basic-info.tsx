"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { cn } from "@/lib/utils"

export default function DiscipleBasicInfo() {
  const [birthDate, setBirthDate] = useState<Date>()
  const [faithDate, setFaithDate] = useState<Date>()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">ชื่อ-นามสกุล</Label>
          <Input id="name" placeholder="กรอกชื่อ-นามสกุล" />
        </div>

        <div className="space-y-2">
          <Label>วันเกิด</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !birthDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {birthDate ? format(birthDate, "PPP", { locale: th }) : "เลือกวันเกิด"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
          <Input id="phone" placeholder="กรอกเบอร์โทรศัพท์" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="line">LINE ID</Label>
          <Input id="line" placeholder="กรอก LINE ID" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input id="facebook" placeholder="กรอกชื่อ Facebook หรือ URL" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="กรอก Email" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>วันที่เริ่มต้นติดตามพระเจ้า / วันรับเชื่อ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !faithDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {faithDate ? format(faithDate, "PPP", { locale: th }) : "เลือกวันที่รับเชื่อ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={faithDate} onSelect={setFaithDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="leader">ผู้นำฝ่ายวิญญาณที่ดูแลอยู่</Label>
          <Input id="leader" placeholder="กรอกชื่อผู้นำ" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">สถานะปัจจุบัน</Label>
        <Select>
          <SelectTrigger id="status">
            <SelectValue placeholder="เลือกสถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">ยังติดต่อ</SelectItem>
            <SelectItem value="distant">ห่างหาย</SelectItem>
            <SelectItem value="not-ready">ไม่พร้อม</SelectItem>
            <SelectItem value="other">อื่นๆ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="habits">นิสัยปัจจุบัน</Label>
        <Textarea id="habits" placeholder="อธิบายนิสัยปัจจุบันของลูกแกะ" rows={4} />
      </div>

      <Button className="w-full">บันทึกข้อมูล</Button>
    </div>
  )
}
