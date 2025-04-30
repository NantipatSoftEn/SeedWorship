import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  // ดึงข้อมูลเซสชันของผู้ใช้
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // ถ้าผู้ใช้พยายามเข้าถึงหน้าที่ต้องล็อกอิน แต่ยังไม่ได้ล็อกอิน
  if (!session && req.nextUrl.pathname.startsWith("/profile")) {
    // เปลี่ยนเส้นทางไปยังหน้าแรก
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: ["/profile/:path*"],
}
