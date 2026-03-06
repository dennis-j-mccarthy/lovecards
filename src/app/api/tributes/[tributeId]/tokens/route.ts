import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { absoluteUrl } from "@/lib/utils"

export async function POST(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId: session.user.id },
  })

  if (!tribute) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Create a general shareable token (no email, unlimited uses)
  const token = await prisma.inviteToken.create({
    data: {
      tributeId: params.tributeId,
      maxUses: null, // unlimited
    },
  })

  const shareUrl = absoluteUrl(
    `/tribute/${tribute.slug}/contribute?token=${token.token}`
  )

  return NextResponse.json({ token: token.token, shareUrl })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId: session.user.id },
  })

  if (!tribute) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const tokens = await prisma.inviteToken.findMany({
    where: { tributeId: params.tributeId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(
    tokens.map((t) => ({
      ...t,
      shareUrl: absoluteUrl(`/tribute/${tribute.slug}/contribute?token=${t.token}`),
    }))
  )
}
