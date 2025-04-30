import type { Metadata } from "next"
import { Sarabun } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/shadcn/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { SupabaseAuthProvider } from "@/components/providers/supabase-auth-provider"
import type { ReactNode } from "react"

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "SeedTrack - รายการเพลง",
  description: "แอปพลิเคชันสำหรับจัดการรายการเพลง",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={sarabun.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseAuthProvider>
            {children}
            <Toaster />
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
