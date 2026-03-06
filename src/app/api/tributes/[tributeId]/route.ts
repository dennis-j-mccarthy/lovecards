import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
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
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId: session.user.id },
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
  templateId: z.string().nullable().optional(),
  allowAnonymous: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  status: z.enum(["ACTIVE", "CLOSED"]).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tribute = await getTributeForOwner(params.tributeId, session.user.id)
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
