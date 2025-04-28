"use client"

import { useState } from "react"
import { Button } from "@/components/shadcn/button"
import { Textarea } from "@/components/shadcn/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shadcn/dialog"
import { convertChordFormat } from "@/utils/chord-formatter"
import { LyricsPreview } from "@/components/shadcn/lyrics-preview"
import { X, FileText, Wand2 } from "lucide-react"

interface ChordConverterProps {
  isOpen: boolean
  onClose: () => void
  onApply: (convertedLyrics: string) => void
}

export function ChordConverter({ isOpen, onClose, onApply }: ChordConverterProps): JSX.Element {
  const [inputLyrics, setInputLyrics] = useState<string>("")
  const [convertedLyrics, setConvertedLyrics] = useState<string>("")
  const [isConverted, setIsConverted] = useState<boolean>(false)

  const handleConvert = (): void => {
    const result = convertChordFormat(inputLyrics)
    setConvertedLyrics(result)
    setIsConverted(true)
  }

  const handleApply = (): void => {
    onApply(convertedLyrics)
    handleClose()
  }

  const handleClose = (): void => {
    setInputLyrics("")
    setConvertedLyrics("")
    setIsConverted(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            แปลงรูปแบบคอร์ด
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">ปิด</span>
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">วางเนื้อเพลงที่มีคอร์ดอยู่ด้านบนเนื้อเพลง เช่น:</p>
            <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-700 overflow-x-auto text-gray-700 dark:text-gray-300 font-sarabun">
              {`                   F                Bb
1: พระเจ้าประทาน พระเยซูพระบุตร 
               F            C7
ทรงรักและให้ อภัยแก่ข้า`}
            </pre>
          </div>

          <Textarea
            placeholder="วางเนื้อเพลงที่มีคอร์ดอยู่ด้านบนเนื้อเพลงที่นี่..."
            value={inputLyrics}
            onChange={(e) => setInputLyrics(e.target.value)}
            className="min-h-[150px] font-mono text-sm border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />

          <div className="flex justify-center">
            <Button
              onClick={handleConvert}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
              disabled={!inputLyrics.trim()}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              แปลงรูปแบบคอร์ด
            </Button>
          </div>

          {isConverted && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">ผลลัพธ์:</h3>
              <Textarea
                value={convertedLyrics}
                readOnly
                className="min-h-[150px] font-mono text-sm border-blue-100 dark:border-blue-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <LyricsPreview lyrics={convertedLyrics} />
            </div>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleApply}
            disabled={!isConverted}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
          >
            นำไปใช้
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
