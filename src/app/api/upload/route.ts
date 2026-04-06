import { NextRequest, NextResponse } from "next/server"
import { getDbUserId } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getDbUserId()
    const tokenValue =
      req.nextUrl.searchParams.get("token") ??
      req.cookies.get("tribute_token")?.value

    const isAuthenticated = !!userId
    const hasToken = tokenValue
      ? !!(await prisma.inviteToken.findFirst({
          where: {
            token: tokenValue,
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
        }))
      : false

    if (!isAuthenticated && !hasToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${crypto.randomUUID()}.${ext}`
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const filePath = path.join(uploadDir, filename)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
