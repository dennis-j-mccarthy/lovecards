import { NextRequest, NextResponse } from "next/server"
import { getDbUserId } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { toPublicContribution } from "@/types/tribute"
import { z } from "zod"

async function getValidatedToken(req: NextRequest, tributeId: string) {
  const tokenValue =
    req.nextUrl.searchParams.get("token") ??
    req.cookies.get("tribute_token")?.value

  if (!tokenValue) return null

  const token = await prisma.inviteToken.findFirst({
    where: {
      token: tokenValue,
      tributeId,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  })

  return token
}

export async function GET(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  // Allow both owners and token holders to list contributions
  const userId = await getDbUserId()
  const token = await getValidatedToken(req, params.tributeId)

  if (!userId && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const isOwner =
    userId &&
    (await prisma.tribute.findFirst({
      where: { id: params.tributeId, userId },
    }))

  const contributions = await prisma.contribution.findMany({
    where: {
      tributeId: params.tributeId,
      status: "APPROVED",
      ...(isOwner ? {} : { isHidden: false }),
    },
    orderBy: { createdAt: "desc" },
  })

  // Owners see all fields; contributors see public view
  if (isOwner) {
    return NextResponse.json(contributions)
  }

  return NextResponse.json(contributions.map(toPublicContribution))
}

const submitSchema = z.object({
  contributorName: z.string().min(1).max(100).optional(),
  contributorEmail: z.string().email().optional(),
  contributorPhone: z.string().max(20).optional(),
  smsOptIn: z.boolean().optional(),
  isAnonymous: z.boolean().default(false),
  avatarUrl: z.string().optional(),
  message: z.string().min(1).max(1000).optional(),
  citationSource: z.string().max(200).optional(),
  photoUrl: z.string().optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  const token = await getValidatedToken(req, params.tributeId)
  const userId = await getDbUserId()

  if (!token && !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tribute = await prisma.tribute.findUnique({
    where: { id: params.tributeId },
  })

  if (!tribute) {
    return NextResponse.json({ error: "Love Card Box not found" }, { status: 404 })
  }

  if (tribute.status === "CLOSED" || tribute.status === "COMPLETED") {
    return NextResponse.json({ error: "This Love Card Box is no longer accepting contributions" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = submitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data

  if (!data.message && !data.photoUrl) {
    return NextResponse.json(
      { error: "Please provide a message, a photo, or both" },
      { status: 400 }
    )
  }

  let type: "TEXT" | "PHOTO" | "TEXT_AND_PHOTO" = "TEXT"
  if (data.message && data.photoUrl) type = "TEXT_AND_PHOTO"
  else if (data.photoUrl) type = "PHOTO"

  const contribution = await prisma.contribution.create({
    data: {
      tributeId: params.tributeId,
      type,
      contributorName: data.isAnonymous ? null : (data.contributorName ?? null),
      contributorEmail: data.contributorEmail ?? null,
      contributorPhone: data.contributorPhone ?? null,
      smsOptIn: data.smsOptIn ?? false,
      isAnonymous: data.isAnonymous,
      avatarUrl: data.isAnonymous ? null : (data.avatarUrl ?? null),
      message: data.message ?? null,
      citationSource: data.citationSource ?? null,
      photoUrl: data.photoUrl ?? null,
      status: "APPROVED",
    },
  })

  // Increment token usage count
  if (token) {
    await prisma.inviteToken.update({
      where: { id: token.id },
      data: {
        usedCount: { increment: 1 },
        usedAt: token.usedAt ?? new Date(),
      },
    })
  }

  return NextResponse.json(toPublicContribution(contribution), { status: 201 })
}
