import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { ContributionSubmitPage } from "./contribute-client"

export default async function ContributePage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { token?: string }
}) {
  const cookieStore = cookies()
  const tokenValue =
    searchParams.token ?? cookieStore.get("tribute_token")?.value

  if (!tokenValue) {
    redirect(`/tribute/${params.slug}?error=token_required`)
  }

  // Validate token
  const token = await prisma.inviteToken.findFirst({
    where: {
      token: tokenValue,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    include: {
      tribute: {
        include: {
          contributions: {
            where: { status: "APPROVED", isHidden: false },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  })

  if (!token) {
    redirect(`/tribute/${params.slug}?error=token_required`)
  }

  if (token.maxUses !== null && token.usedCount >= token.maxUses) {
    redirect(`/tribute/${params.slug}?error=token_required`)
  }

  const { tribute } = token

  if (tribute.slug !== params.slug) {
    redirect(`/tribute/${params.slug}?error=token_required`)
  }

  if (tribute.status === "CLOSED" || tribute.status === "COMPLETED") {
    redirect(`/tribute/${params.slug}`)
  }

  const initialContributions = tribute.contributions.map((c) => ({
    id: c.id,
    type: c.type,
    isAnonymous: c.isAnonymous,
    contributorName: c.isAnonymous ? null : c.contributorName,
    avatarUrl: c.isAnonymous ? null : c.avatarUrl,
    message: c.message,
    photoUrl: c.photoUrl,
    createdAt: c.createdAt,
  }))

  return (
    <ContributionSubmitPage
      tributeId={tribute.id}
      tributeSlug={tribute.slug}
      honoredName={tribute.honoredName}
      token={tokenValue}
      allowAnonymous={tribute.allowAnonymous}
      initialContributions={initialContributions}
    />
  )
}
