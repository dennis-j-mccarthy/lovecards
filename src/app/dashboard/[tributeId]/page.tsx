import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { toPublicContribution } from "@/types/tribute"
import { DashboardLiveFeed } from "@/components/dashboard/dashboard-live-feed"
import { CopyButton } from "@/components/dashboard/copy-button"
import { absoluteUrl } from "@/lib/utils"

export default async function TributeDashboardPage({
  params,
}: {
  params: { tributeId: string }
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId: session.user.id },
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
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Nav */}
      <nav className="border-b border-[#d4c5a9] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <Link href="/dashboard" className="text-xs tracking-[3px] uppercase text-[#8b7355]">
            ← My Tributes
          </Link>
          <div className="flex-1" />
          <Link
            href={`/dashboard/${tribute.id}/invite`}
            className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            Invite
          </Link>
          <Link
            href={`/dashboard/${tribute.id}/design`}
            className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            Design
          </Link>
          {tribute.status === "COMPLETED" && tribute.pdfUrl && (
            <a
              href={tribute.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm border border-[#8b7355] text-[#8b7355] px-3 py-1.5 hover:bg-[#8b7355] hover:text-white transition-colors"
            >
              Download PDF
            </a>
          )}
          {(tribute.status === "ACTIVE" || tribute.status === "CLOSED") && (
            <Link
              href={`/dashboard/${tribute.id}/generate`}
              className="text-sm bg-[#1a1a1a] text-white px-4 py-2 hover:bg-[#333] transition-colors"
            >
              Generate Cards
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-[2px] uppercase text-[#8b7355] mb-1">
            {tribute.relationship}
          </p>
          <h1 className="text-4xl font-normal text-[#1a1a1a]">{tribute.honoredName}</h1>
          {(tribute.birthDate || tribute.passingDate) && (
            <p className="text-sm text-[#999] mt-2">
              {tribute.birthDate ? formatDate(tribute.birthDate) : ""}
              {tribute.birthDate && tribute.passingDate ? " — " : ""}
              {tribute.passingDate ? formatDate(tribute.passingDate) : ""}
            </p>
          )}
        </div>

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
            <div key={label} className="border border-[#d4c5a9] bg-white p-4">
              <p className="text-xs tracking-[2px] uppercase text-[#8b7355] mb-1">
                {label}
              </p>
              <p className="text-lg text-[#1a1a1a]">{value}</p>
            </div>
          ))}
        </div>

        {/* Share link */}
        {shareUrl && (
          <div className="border border-[#d4c5a9] bg-white p-4 mb-8 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs tracking-[2px] uppercase text-[#8b7355] mb-1">
                Shareable Link
              </p>
              <p className="text-sm text-[#666] truncate">{shareUrl}</p>
            </div>
            <CopyButton text={shareUrl} />
          </div>
        )}

        {/* Live feed with gallery */}
        <DashboardLiveFeed
          tributeId={tribute.id}
          initialContributions={publicContributions}
        />
      </div>
    </div>
  )
}

