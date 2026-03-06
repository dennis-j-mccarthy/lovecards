import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { CreateTestTributeButton } from "@/components/dev/create-test-tribute-button"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const tributes = await prisma.tribute.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { contributions: { where: { isHidden: false } } } },
    },
    orderBy: { createdAt: "desc" },
  })

  const STATUS_LABELS: Record<string, string> = {
    DRAFT: "Draft",
    ACTIVE: "Active",
    CLOSED: "Closed",
    GENERATING: "Generating PDF...",
    COMPLETED: "Completed",
  }

  const STATUS_COLORS: Record<string, string> = {
    DRAFT: "text-[#999] border-[#ddd]",
    ACTIVE: "text-green-700 border-green-200",
    CLOSED: "text-[#888] border-[#ddd]",
    GENERATING: "text-blue-700 border-blue-200",
    COMPLETED: "text-[#8b7355] border-[#d4c5a9]",
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <nav className="border-b border-[#d4c5a9] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xs tracking-[3px] uppercase text-[#8b7355]">
            Love Cards
          </Link>
          <Link
            href="/checkout"
            className="text-sm border border-[#1a1a1a] px-4 py-2 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
          >
            New Tribute
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-normal text-[#1a1a1a] mb-8">My Tributes</h1>

        {tributes.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#d4c5a9]">
            <p className="text-[#8b7355] text-xs tracking-[2px] uppercase mb-3">
              No tributes yet
            </p>
            <p className="text-[#666] text-sm mb-6">
              Create your first memorial tribute card collection
            </p>
            <Link
              href="/checkout"
              className="inline-block bg-[#1a1a1a] text-white px-8 py-3 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors"
            >
              Create a Tribute — $99
            </Link>
            {process.env.NODE_ENV !== "production" && (
              <div className="mt-4">
                <CreateTestTributeButton />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tributes.map((tribute) => (
              <Link
                key={tribute.id}
                href={`/dashboard/${tribute.id}`}
                className="block border border-[#d4c5a9] bg-white p-6 hover:border-[#8b7355] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[2px] uppercase text-[#8b7355] mb-1">
                      {tribute.relationship}
                    </p>
                    <h2 className="text-xl font-normal text-[#1a1a1a]">
                      {tribute.honoredName}
                    </h2>
                    <p className="text-sm text-[#999] mt-1">
                      {tribute._count.contributions} contribution
                      {tribute._count.contributions !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-xs border px-2 py-1 ${
                        STATUS_COLORS[tribute.status] ?? ""
                      }`}
                    >
                      {STATUS_LABELS[tribute.status] ?? tribute.status}
                    </span>
                    <p className="text-xs text-[#bbb] mt-2">
                      Created {formatDate(tribute.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
