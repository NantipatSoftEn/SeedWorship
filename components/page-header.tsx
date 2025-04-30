import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  rightContent?: ReactNode
}

export function PageHeader({ title, description, rightContent }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  )
}
