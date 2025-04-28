import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps): JSX.Element {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />
}

export { Skeleton }
