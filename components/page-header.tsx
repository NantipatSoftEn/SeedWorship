import type { ReactNode } from "react"

interface PageHeaderProps {
    title: string
    description?: string
    rightContent?: ReactNode
}

export function PageHeader({ title, description, rightContent }: PageHeaderProps): JSX.Element {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-primary">{title}</h1>
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            {rightContent && <div>{rightContent}</div>}
        </div>
    )
}
