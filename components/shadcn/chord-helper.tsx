"use client"

import { useState } from "react"
import { Button } from "@/components/shadcn/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import { cn } from "@/lib/utils"

interface ChordHelperProps {
  onInsertChord: (chord: string) => void
  className?: string
}

export function ChordHelper({ onInsertChord, className }: ChordHelperProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false)

  const handleChordClick = (chord: string): void => {
    onInsertChord(chord)
    setOpen(false)
  }

  const commonChords = ["C", "D", "E", "F", "G", "A", "B"]
  const minorChords = ["Cm", "Dm", "Em", "Fm", "Gm", "Am", "Bm"]
  const seventhChords = ["C7", "D7", "E7", "F7", "G7", "A7", "B7"]
  const otherChords = ["Csus4", "Dsus4", "Esus4", "Fsus4", "Gsus4", "Asus4", "Bsus4"]
  const flatSharpChords = ["C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900",
            className,
          )}
        >
          เพิ่มคอร์ด
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800" align="start">
        <div className="p-4 pb-0">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">เลือกคอร์ดที่ต้องการเพิ่ม</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            คลิกที่คอร์ดเพื่อแทรกลงในเนื้อเพลง คอร์ดจะถูกแทรกในรูปแบบ [คอร์ด]
          </p>
        </div>
        <Tabs defaultValue="common">
          <div className="px-4">
            <TabsList className="w-full bg-gray-100 dark:bg-gray-700">
              <TabsTrigger
                value="common"
                className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-800 dark:data-[state=active]:text-blue-300"
              >
                คอร์ดทั่วไป
              </TabsTrigger>
              <TabsTrigger
                value="minor"
                className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-800 dark:data-[state=active]:text-blue-300"
              >
                คอร์ดไมเนอร์
              </TabsTrigger>
              <TabsTrigger
                value="seventh"
                className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-800 dark:data-[state=active]:text-blue-300"
              >
                คอร์ด 7
              </TabsTrigger>
              <TabsTrigger
                value="other"
                className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-800 dark:data-[state=active]:text-blue-300"
              >
                อื่นๆ
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="common" className="p-4 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {commonChords.map((chord) => (
                <Button
                  key={chord}
                  variant="outline"
                  size="sm"
                  className="text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={() => handleChordClick(chord)}
                >
                  {chord}
                </Button>
              ))}
              {flatSharpChords.slice(0, 5).map((chord) => (
                <Button
                  key={chord}
                  variant="outline"
                  size="sm"
                  className="text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={() => handleChordClick(chord)}
                >
                  {chord}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="minor" className="p-4 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {minorChords.map((chord) => (
                <Button
                  key={chord}
                  variant="outline"
                  size="sm"
                  className="text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={() => handleChordClick(chord)}
                >
                  {chord}
                </Button>
              ))}
              {flatSharpChords.slice(5).map((chord) => (
                <Button
                  key={chord}
                  variant="outline"
                  size="sm"
                  className="text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={() => handleChordClick(chord)}
                >
                  {chord}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="seventh" className="p-4 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {seventhChords.map((chord) => (
                <Button
                  key={chord}
                  variant="outline"
                  size="sm"
                  className="text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={() => handleChordClick(chord)}
                >
                  {chord}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="other" className="p-4 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {otherChords.map((chord) => (
                <Button
                  key={chord}
                  variant="outline"
                  size="sm"
                  className="text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={() => handleChordClick(chord)}
                >
                  {chord}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <div className="p-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>วิธีใช้:</strong> วางเคอร์เซอร์ในตำแหน่งที่ต้องการแทรกคอร์ด แล้วคลิกที่คอร์ดที่ต้องการ
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
