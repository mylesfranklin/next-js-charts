import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Check if we're in development mode and if there's a bypass query parameter
  const isDev = process.env.NODE_ENV === "development"
  const url = new URL(request.url)
  const bypassAuth = url.searchParams.get("bypass_auth") === "true"

  // If we're in development and bypassing auth, allow access
  if (isDev && bypassAuth && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup")

  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return res
  }

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return res
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"],
}
