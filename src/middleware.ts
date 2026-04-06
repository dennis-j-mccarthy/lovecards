import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware((auth, req) => {
  const { pathname, searchParams } = req.nextUrl

  // Protect dashboard routes
  if (isProtectedRoute(req)) {
    auth().protect()
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
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
