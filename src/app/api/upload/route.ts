import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname) => {
        // Validate the requester is either a session user or a valid token holder
        const session = await auth()
        const tokenValue = req.nextUrl.searchParams.get("token") ??
          req.cookies.get("tribute_token")?.value

        const isAuthenticated = !!session?.user?.id
        const hasToken = tokenValue
          ? !!(await prisma.inviteToken.findFirst({
              where: {
                token: tokenValue,
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
              },
            }))
          : false

        if (!isAuthenticated && !hasToken) {
          throw new Error("Unauthorized")
        }

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Upload completed:", blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
