import type * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcn/button"
import type { ButtonProps } from "@/components/shadcn/button"

interface PaginationProps {
  className?: string
  children?: React.ReactNode
}

const Pagination = ({ className, children }: PaginationProps): JSX.Element => {
  return <nav className={cn("mx-auto flex w-full justify-center", className)}>{children}</nav>
}

interface PaginationContentProps {
  className?: string
  children?: React.ReactNode
}

const PaginationContent = ({ className, children }: PaginationContentProps): JSX.Element => {
  return <ul className={cn("flex flex-row items-center gap-1", className)}>{children}</ul>
}

interface PaginationItemProps {
  className?: string
  children?: React.ReactNode
}

const PaginationItem = ({ className, children }: PaginationItemProps): JSX.Element => {
  return <li className={cn("", className)}>{children}</li>
}

interface PaginationLinkProps extends React.ComponentProps<"a">, ButtonProps {
  isActive?: boolean
}

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps): JSX.Element => {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(
        isActive &&
          "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-900 dark:hover:text-blue-300",
        className,
      )}
      {...props}
    />
  )
}

interface PaginationPreviousProps extends React.ComponentProps<typeof PaginationLink> {}

const PaginationPrevious = ({ className, ...props }: PaginationPreviousProps): JSX.Element => {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>ก่อนหน้า</span>
    </PaginationLink>
  )
}

interface PaginationNextProps extends React.ComponentProps<typeof PaginationLink> {}

const PaginationNext = ({ className, ...props }: PaginationNextProps): JSX.Element => {
  return (
    <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
      <span>ถัดไป</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}

interface PaginationEllipsisProps {
  className?: string
}

const PaginationEllipsis = ({ className }: PaginationEllipsisProps): JSX.Element => {
  return (
    <div className={cn("flex h-9 w-9 items-center justify-center", className)}>
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </div>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
