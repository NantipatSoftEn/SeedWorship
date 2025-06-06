"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> {
    type?: "single" | "multiple"
    collapsible?: boolean
    className?: string
}

const Accordion = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Root>,
    AccordionProps
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Root ref={ref} className={cn("w-full", className)} {...props} />
))
Accordion.displayName = "Accordion"

interface AccordionItemProps
    extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
    className?: string
    value: string
}

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    AccordionItemProps
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps
    extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
    className?: string
}

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

interface AccordionContentProps
    extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {
    className?: string
}

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    AccordionContentProps
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
            className
        )}
        {...props}
    >
        <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
