import { NextRequest, NextResponse } from "next/server"
import { getDbUserId } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

async function getTributeForOwner(tributeId: string, userId: string) {
  return prisma.tribute.findFirst({
    where: { id: tributeId, userId },
  })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  const userId = await getDbUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId },
    include: {
      template: true,
      contributions: {
        orderBy: { createdAt: "desc" },
      },
      inviteTokens: true,
      _count: { select: { contributions: true } },
    },
  })

  if (!tribute) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(tribute)
}

const updateSchema = z.object({
  honoredName: z.string().min(1).max(100).optional(),
  relationship: z.string().min(1).max(100).optional(),
  tributeMessage: z.string().min(1).max(2000).optional(),
  honoredPhoto: z.string().url().nullable().optional(),
  birthDate: z.string().nullable().optional(),
  passingDate: z.string().nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  shipToName: z.string().max(100).nullable().optional(),
  shipToAddress: z.string().max(200).nullable().optional(),
  shipToCity: z.string().max(100).nullable().optional(),
  shipToState: z.string().max(50).nullable().optional(),
  shipToZip: z.string().max(20).nullable().optional(),
  templateId: z.string().nullable().optional(),
  allowAnonymous: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  status: z.enum(["ACTIVE", "CLOSED"]).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  const userId = await getDbUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tribute = await getTributeForOwner(params.tributeId, userId)
  if (!tribute) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data

  const updated = await prisma.tribute.update({
    where: { id: params.tributeId },
    data: {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : data.birthDate === null ? null : undefined,
      passingDate: data.passingDate ? new Date(data.passingDate) : data.passingDate === null ? null : undefined,
      closedAt: data.status === "CLOSED" ? new Date() : undefined,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  const userId = await getDbUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tribute = await getTributeForOwner(params.tributeId, userId)
  if (!tribute) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Cascade delete in order
  await prisma.contribution.deleteMany({ where: { tributeId: tribute.id } })
  await prisma.inviteEmail.deleteMany({ where: { tributeId: tribute.id } })
  await prisma.inviteToken.deleteMany({ where: { tributeId: tribute.id } })
  await prisma.tribute.delete({ where: { id: tribute.id } })
  if (tribute.paymentId) {
    await prisma.payment.delete({ where: { id: tribute.paymentId } }).catch(() => {})
  }

  return NextResponse.json({ deleted: true })
}
