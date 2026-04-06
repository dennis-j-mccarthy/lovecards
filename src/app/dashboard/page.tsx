import { getDbUser } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { CreateTestTributeButton } from "@/components/dev/create-test-tribute-button"
import { isDemo } from "@/lib/demo"

export default async function DashboardPage() {
  const user = await getDbUser()
  if (!user) redirect("/sign-in")

  const tributes = await prisma.tribute.findMany({
    where: { userId: user.id },
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
    DRAFT: "text-gray-400 border-gray-200",
    ACTIVE: "text-green-700 border-green-200",
    CLOSED: "text-gray-400 border-gray-200",
    GENERATING: "text-blue-700 border-blue-200",
    COMPLETED: "text-[#800020] border-[#e5e7eb]",
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-normal text-[#111827]">My Love Card Boxes</h1>
          <Link
            href="/checkout"
            className="text-sm font-medium text-white px-5 py-2.5 rounded-lg transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #800020 0%, #5c0018 100%)' }}
          >
            + New Love Card Box
          </Link>
        </div>

        {tributes.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#e5e7eb]">
            <p className="text-[#800020] text-xs tracking-[2px] uppercase mb-3">
              No Love Card Boxes yet
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Create your first Love Card Box
            </p>
            <Link
              href="/checkout"
              className="inline-block bg-gray-900 text-white px-8 py-3 text-sm font-medium tracking-wide uppercase rounded-lg hover:bg-[#333] transition-colors"
            >
              Create a Love Card Box — $49
            </Link>
            {isDemo() && (
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
                href={`/dashboard/${tribute.id}/invite`}
                className="block border border-[#e5e7eb] bg-white p-6 hover:border-[#800020] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[2px] uppercase text-[#800020] mb-1">
                      {tribute.relationship}
                    </p>
                    <h2 className="text-xl font-normal text-[#111827]">
                      {tribute.honoredName}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
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
                    <p className="text-xs text-gray-300 mt-2">
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
