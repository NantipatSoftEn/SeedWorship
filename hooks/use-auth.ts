"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@/utils/supabase"
import type { UserSession } from "@/types/song"

export function useAuth(): UserSession {
  const [session, setSession] = useState<UserSession>({ user: null })
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession({ user: data.session?.user || null })
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession({ user: session?.user || null })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return session
}
