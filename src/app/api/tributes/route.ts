import { NextRequest, NextResponse } from "next/server"
import { getDbUserId } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"
import { z } from "zod"

const createTributeSchema = z.object({
  paymentId: z.string(),
  honoredName: z.string().min(1).max(100),
  relationship: z.string().min(1).max(100),
  tributeMessage: z.string().min(1).max(2000),
  honoredPhoto: z.string().url().optional(),
  birthDate: z.string().optional(),
  passingDate: z.string().optional(),
  location: z.string().max(100).optional(),
  shipToName: z.string().max(100).optional(),
  shipToAddress: z.string().max(200).optional(),
  shipToCity: z.string().max(100).optional(),
  shipToState: z.string().max(50).optional(),
  shipToZip: z.string().max(20).optional(),
})

export async function POST(req: NextRequest) {
  const userId = await getDbUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createTributeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data

  // Verify the payment belongs to this user and is completed
  const payment = await prisma.payment.findFirst({
    where: {
      id: data.paymentId,
      userId,
      status: "COMPLETED",
    },
    include: { tribute: true },
  })

  if (!payment) {
    return NextResponse.json({ error: "Payment not found or not completed" }, { status: 404 })
  }

  if (payment.tribute) {
    return NextResponse.json({ error: "Love Card Box already created for this payment" }, { status: 409 })
  }

  const slug = generateSlug(data.honoredName)

  const tribute = await prisma.tribute.create({
    data: {
      userId,
      paymentId: data.paymentId,
      slug,
      honoredName: data.honoredName,
      relationship: data.relationship,
      tributeMessage: data.tributeMessage,
      honoredPhoto: data.honoredPhoto,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      passingDate: data.passingDate ? new Date(data.passingDate) : undefined,
      location: data.location,
      shipToName: data.shipToName,
      shipToAddress: data.shipToAddress,
      shipToCity: data.shipToCity,
      shipToState: data.shipToState,
      shipToZip: data.shipToZip,
      status: "ACTIVE",
    },
  })

  // Create a default shareable invite token
  await prisma.inviteToken.create({
    data: {
      tributeId: tribute.id,
    },
  })

  return NextResponse.json(tribute, { status: 201 })
}

export async function GET(_req: NextRequest) {
  const userId = await getDbUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tributes = await prisma.tribute.findMany({
    where: { userId },
    include: {
      _count: { select: { contributions: true } },
      template: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(tributes)
}
