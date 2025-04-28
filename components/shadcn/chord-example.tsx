"use client"

import { Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcn/accordion"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

interface ChordExampleProps {
  className?: string
}

export function ChordExample({ className }: ChordExampleProps): JSX.Element {
  return (
    <Accordion type="single" collapsible className={cn("w-full", className)}>
      <AccordionItem value="example" className="border-b-gray-200 dark:border-b-gray-700">
        <AccordionTrigger className="text-sm text-blue-700 dark:text-blue-400 py-2 hover:no-underline">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>ตัวอย่างการใส่คอร์ดในเนื้อเพลง</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>คอร์ดจะถูกเขียนในวงเล็บเหลี่ยม เช่น [G], [C], [D]</p>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-700">
              <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">ตัวอย่าง:</p>
              <pre className="text-xs whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sarabun">
                {`[G]พระเจ้าทรงเป็นความ[D]รัก
[C]พระองค์ทรงรัก[G]เรา

[Em]พระองค์ทรงส่งพระ[D]บุตร
[C]มาสิ้นพระชนม์เพื่อ[G]เรา`}
              </pre>
            </div>
            <p>เมื่อเปิดใช้งานฟีเจอร์ "ซ่อนคอร์ด" คอร์ดในวงเล็บเหลี่ยมจะถูกซ่อนไว้ และจะแสดงเฉพาะเนื้อเพลงเท่านั้น</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
