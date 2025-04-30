"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { cn } from "@/lib/utils"

interface CollapsibleProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> {
  className?: string
}

const Collapsible = React.forwardRef<React.ElementRef<typeof CollapsiblePrimitive.Root>, CollapsibleProps>(
  ({ className, ...props }, ref) => (
    <CollapsiblePrimitive.Root ref={ref} className={cn("w-full", className)} {...props} />
  ),
)
Collapsible.displayName = CollapsiblePrimitive.Root.displayName

interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> {
  className?: string
  asChild?: boolean
}

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsibleTriggerProps
>(({ className, asChild = false, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger ref={ref} className={cn("w-full", className)} asChild={asChild} {...props} />
))
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName

interface CollapsibleContentProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content> {
  className?: string
}

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  CollapsibleContentProps
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden transition-all",
      className,
    )}
    {...props}
  />
))
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
