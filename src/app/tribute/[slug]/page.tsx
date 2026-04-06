import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { toPublicContribution } from "@/types/tribute"
import { ContributionGallery } from "@/components/tribute/contribution-gallery"
import Image from "next/image"

export default async function TributePage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { error?: string }
}) {
  const tribute = await prisma.tribute.findUnique({
    where: { slug: params.slug },
    include: {
      contributions: {
        where: { status: "APPROVED", isHidden: false },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!tribute) notFound()

  const publicContributions = tribute.contributions.map(toPublicContribution)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#e5e7eb] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/">
            <img src="/logo.png" alt="Love Cards" className="h-[200px] mx-auto mb-8" />
          </Link>
          {tribute.honoredPhoto && (
            <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#e5e7eb]">
              <Image
                src={tribute.honoredPhoto}
                alt={tribute.honoredName}
                fill
                className="object-cover"
              />
            </div>
          )}

          <p className="text-xs tracking-[4px] uppercase text-[#800020] mb-3">
            In Loving Memory
          </p>
          <h1 className="text-5xl font-normal text-[#111827] mb-3">
            {tribute.honoredName}
          </h1>

          {(tribute.birthDate || tribute.passingDate) && (
            <p className="text-sm text-gray-400 mb-4">
              {tribute.birthDate ? formatDate(tribute.birthDate) : ""}
              {tribute.birthDate && tribute.passingDate ? " — " : ""}
              {tribute.passingDate ? formatDate(tribute.passingDate) : ""}
            </p>
          )}

          {tribute.location && (
            <p className="text-sm text-gray-400 mb-6">{tribute.location}</p>
          )}

          <blockquote className="text-base leading-relaxed text-[#555] italic max-w-xl mx-auto border-l-2 border-[#e5e7eb] pl-4 text-left">
            {tribute.tributeMessage}
          </blockquote>
        </div>
      </div>

      {/* Token error */}
      {searchParams.error === "token_required" && (
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="p-3 border border-amber-200 bg-amber-50 text-amber-700 text-sm">
            You need an invitation link to submit a contribution. Please check your
            email for an invitation, or ask the organizer for the link.
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-normal text-[#111827]">
            Memories Shared
            <span className="ml-2 text-sm text-gray-400">
              ({publicContributions.length})
            </span>
          </h2>
        </div>

        <ContributionGallery
          initialContributions={publicContributions}
          tributeId={tribute.id}
          isOwner={false}
        />
      </div>

      <footer className="border-t border-[#e5e7eb] py-8 px-6 text-center mt-8">
        <Link href="/">
          <img src="/logo.png" alt="Love Cards" className="h-24 mx-auto opacity-60 hover:opacity-100 transition-opacity" />
        </Link>
      </footer>
    </div>
  )
}
