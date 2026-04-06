import { getDbUserId } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { TemplatePicker } from "@/components/design/template-picker"

export default async function DesignPage({
  params,
}: {
  params: { tributeId: string }
}) {
  const userId = await getDbUserId()
  if (!userId) redirect("/sign-in")

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId },
    include: { template: true },
  })

  if (!tribute) notFound()

  const templates = await prisma.designTemplate.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <img src="/logo.png" alt="Love Cards" className="h-[200px]" />
          </Link>
        </div>
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
            href={`/dashboard/${tribute.id}`}
            className="text-xs tracking-[2px] uppercase text-[#800020]"
          >
            ← Back
          </Link>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs tracking-[2px] uppercase text-gray-500">
            Choose a Design
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-normal text-[#111827] mb-2">Card Design</h1>
        <p className="text-sm text-gray-500 mb-8">
          Choose the visual style for your tribute cards. This affects colors, fonts,
          and overall aesthetic.
        </p>

        <TemplatePicker
          templates={templates}
          selectedId={tribute.templateId}
          tributeId={tribute.id}
        />
      </div>
    </div>
  )
}
