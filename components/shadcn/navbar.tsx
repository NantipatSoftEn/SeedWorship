"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { createClientComponentClient } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Music, LogIn, LogOut, UserPlus } from "lucide-react"

export function NavBar() {
  const session = useAuth()
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      })
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Music className="h-6 w-6" />
          <span className="font-bold text-xl">SeedTrack</span>
        </Link>
        <nav className="flex items-center gap-4">
          {session.user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <LogIn size={16} />
                  <span>Login</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm" className="flex items-center gap-1">
                  <UserPlus size={16} />
                  <span>Register</span>
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
