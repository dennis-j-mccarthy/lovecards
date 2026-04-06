import { NextRequest, NextResponse } from "next/server"
import { getDbUserId } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateSchema = z.object({
  isHidden: z.boolean().optional(),
  status: z.enum(["APPROVED", "HIDDEN"]).optional(),
  message: z.string().max(1000).optional(),
})

async function getContributionWithOwnerCheck(contributionId: string, userId: string) {
  const contribution = await prisma.contribution.findFirst({
    where: { id: contributionId },
    include: { tribute: true },
  })

  if (!contribution) return null
  if (contribution.tribute.userId !== userId) return null
  return contribution
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { contributionId: string } }
) {
  const userId = await getDbUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const contribution = await getContributionWithOwnerCheck(params.contributionId, userId)
  if (!contribution) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const updated = await prisma.contribution.update({
    where: { id: params.contributionId },
    data: parsed.data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { contributionId: string } }
) {
  const userId = await getDbUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const contribution = await getContributionWithOwnerCheck(params.contributionId, userId)
  if (!contribution) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.contribution.delete({ where: { id: params.contributionId } })

  return NextResponse.json({ deleted: true })
}
