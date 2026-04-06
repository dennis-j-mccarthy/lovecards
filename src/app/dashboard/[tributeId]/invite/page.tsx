import { getDbUserId } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { absoluteUrl } from "@/lib/utils"
import { InviteForm } from "./invite-form"

export default async function InvitePage({
  params,
}: {
  params: { tributeId: string }
}) {
  const userId = await getDbUserId()
  if (!userId) redirect("/sign-in")

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId },
    include: {
      inviteTokens: {
        orderBy: { createdAt: "asc" },
      },
      emails: {
        orderBy: { sentAt: "desc" },
      },
    },
  })

  if (!tribute) notFound()

  const shareToken = tribute.inviteTokens.find((t) => t.email === null)
  const shareUrl = shareToken
    ? absoluteUrl(`/tribute/${tribute.slug}/contribute?token=${shareToken.token}`)
    : null

  // Split invited people into pending vs contributed
  const emailTokens = tribute.inviteTokens.filter((t) => t.email !== null)
  const unusedEmails = new Set(
    emailTokens.filter((t) => t.usedCount === 0).map((t) => t.email!)
  )
  const usedEmails = new Set(
    emailTokens.filter((t) => t.usedCount > 0).map((t) => t.email!)
  )

  const pendingInvitees = tribute.emails
    .filter((e) => unusedEmails.has(e.toEmail))
    .map((e) => ({
      id: e.id,
      email: e.toEmail,
      name: e.toName,
      cellPhone: e.toCellPhone,
      phone: e.toPhone,
      sentAt: e.sentAt.toISOString(),
      contributed: false as const,
    }))

  const completedInvitees = tribute.emails
    .filter((e) => usedEmails.has(e.toEmail))
    .map((e) => ({
      id: e.id,
      email: e.toEmail,
      name: e.toName,
      cellPhone: e.toCellPhone,
      phone: e.toPhone,
      sentAt: e.sentAt.toISOString(),
      contributed: true as const,
    }))

  return (
    <InviteForm
      tributeId={tribute.id}
      shareUrl={shareUrl}
      pendingInvitees={pendingInvitees}
      completedInvitees={completedInvitees}
    />
  )
}
