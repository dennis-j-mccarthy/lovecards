import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  // Protect dashboard routes — check for NextAuth session cookie
  if (pathname.startsWith("/dashboard")) {
    // NextAuth v5 session token cookie names
    const sessionToken =
      req.cookies.get("authjs.session-token")?.value ??
      req.cookies.get("__Secure-authjs.session-token")?.value ??
      req.cookies.get("next-auth.session-token")?.value ??
      req.cookies.get("__Secure-next-auth.session-token")?.value

    if (!sessionToken) {
      const signInUrl = new URL("/sign-in", req.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Contributor routes — validate invite token from query param or cookie
  if (pathname.includes("/contribute")) {
    const token =
      searchParams.get("token") ?? req.cookies.get("tribute_token")?.value

    if (!token) {
      const slug = pathname.split("/")[2]
      const tributeUrl = new URL(`/tribute/${slug}`, req.url)
      tributeUrl.searchParams.set("error", "token_required")
      return NextResponse.redirect(tributeUrl)
    }

    const response = NextResponse.next()
    if (searchParams.get("token")) {
      response.cookies.set("tribute_token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/tribute/:slug/contribute/:path*"],
}
