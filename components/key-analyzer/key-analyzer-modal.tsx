"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { KeyAnalyzerForm } from "@/components/key-analyzer/key-analyzer-form"

interface KeyAnalyzerModalProps {
    buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
    buttonSize?: "default" | "sm" | "lg" | "icon"
    buttonText?: string
    fullWidth?: boolean
}

export function KeyAnalyzerModal({
    buttonVariant = "default",
    buttonSize = "default",
    buttonText = "วิเคราะห์คีย์",
    fullWidth = false,
}: KeyAnalyzerModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={buttonVariant}
                    size={buttonSize}
                    className={fullWidth ? "w-full" : ""}
                >
                    <Search className="mr-2 h-4 w-4" />
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>วิเคราะห์คีย์เพลง</DialogTitle>
                    <DialogDescription>ป้อนคอร์ดเพลงเพื่อวิเคราะห์คีย์</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <KeyAnalyzerForm />
                </div>
            </DialogContent>
        </Dialog>
    )
}
