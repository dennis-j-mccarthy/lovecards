import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  const tributeId = req.nextUrl.searchParams.get("tributeId")

  if (!token) {
    return NextResponse.json({ valid: false, error: "No token provided" })
  }

  const record = await prisma.inviteToken.findFirst({
    where: {
      token,
      ...(tributeId ? { tributeId } : {}),
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      // If maxUses is set, ensure usedCount < maxUses
    },
    include: {
      tribute: {
        select: {
          id: true,
          slug: true,
          honoredName: true,
          status: true,
        },
      },
    },
  })

  if (!record) {
    return NextResponse.json({ valid: false, error: "Invalid or expired token" })
  }

  if (record.maxUses !== null && record.usedCount >= record.maxUses) {
    return NextResponse.json({ valid: false, error: "Token has reached its usage limit" })
  }

  return NextResponse.json({
    valid: true,
    tribute: record.tribute,
  })
}
