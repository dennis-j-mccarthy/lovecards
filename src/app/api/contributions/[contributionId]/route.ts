import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateSchema = z.object({
  isHidden: z.boolean().optional(),
  status: z.enum(["APPROVED", "HIDDEN"]).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { contributionId: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Verify the contribution belongs to a tribute owned by this user
  const contribution = await prisma.contribution.findFirst({
    where: { id: params.contributionId },
    include: { tribute: true },
  })

  if (!contribution) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (contribution.tribute.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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
