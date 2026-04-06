import { getDbUser } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { toPublicContribution } from "@/types/tribute"
import { DashboardLiveFeed } from "@/components/dashboard/dashboard-live-feed"
import { CopyButton } from "@/components/dashboard/copy-button"
import { TributeHeader } from "@/components/dashboard/tribute-header"
import { DeleteTributeButton } from "@/components/dashboard/delete-tribute-button"
import { StepProgression } from "@/components/dashboard/step-progression"
import { absoluteUrl } from "@/lib/utils"

export default async function TributeDashboardPage({
  params,
}: {
  params: { tributeId: string }
}) {
  const user = await getDbUser()
  if (!user) redirect("/sign-in")

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId: user.id },
    include: {
      contributions: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
      inviteTokens: {
        where: { email: null }, // General shareable tokens
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  })

  if (!tribute) notFound()

  const shareToken = tribute.inviteTokens[0]
  const shareUrl = shareToken
    ? absoluteUrl(`/tribute/${tribute.slug}/contribute?token=${shareToken.token}`)
    : null

  const publicContributions = tribute.contributions.map(toPublicContribution)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <StepProgression tributeId={tribute.id} activeStep={2} />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        {/* Header with edit/delete */}
        <TributeHeader
          tributeId={tribute.id}
          honoredName={tribute.honoredName}
          relationship={tribute.relationship}
          tributeMessage={tribute.tributeMessage}
          birthDate={tribute.birthDate?.toISOString() ?? null}
          passingDate={tribute.passingDate?.toISOString() ?? null}
          location={tribute.location}
          shipToName={tribute.shipToName}
          shipToAddress={tribute.shipToAddress}
          shipToCity={tribute.shipToCity}
          shipToState={tribute.shipToState}
          shipToZip={tribute.shipToZip}
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Contributions",
              value: tribute.contributions.length,
            },
            {
              label: "Status",
              value: tribute.status.charAt(0) + tribute.status.slice(1).toLowerCase(),
            },
            {
              label: "Created",
              value: formatDate(tribute.createdAt),
            },
          ].map(({ label, value }) => (
            <div key={label} className="border border-[#e5e7eb] bg-white p-4">
              <p className="text-xs tracking-[2px] uppercase text-[#800020] mb-1">
                {label}
              </p>
              <p className="text-lg text-[#111827]">{value}</p>
            </div>
          ))}
        </div>

        {/* Share link */}
        {shareUrl && (
          <div className="border border-[#e5e7eb] bg-white p-4 mb-8 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs tracking-[2px] uppercase text-[#800020] mb-1">
                Shareable Link
              </p>
              <p className="text-sm text-gray-500 truncate">{shareUrl}</p>
            </div>
            <CopyButton text={shareUrl} />
          </div>
        )}

        {/* Live feed with gallery */}
        <DashboardLiveFeed
          tributeId={tribute.id}
          initialContributions={publicContributions}
        />

        {/* Invite more */}
        <div className="mt-8 text-center">
          <Link
            href={`/dashboard/${tribute.id}/invite`}
            className="inline-flex items-center gap-2 border border-[#e5e7eb] text-[#800020] px-6 py-3 text-sm tracking-[1px] uppercase hover:bg-[#fdf2f4] transition-colors"
          >
            + Invite More People
          </Link>
        </div>

        {/* Danger zone */}
        <div className="mt-12 pt-8 border-t border-[#e5e7eb]">
          <DeleteTributeButton tributeId={tribute.id} />
        </div>
      </div>
    </div>
  )
}
