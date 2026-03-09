import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { TemplatePicker } from "@/components/design/template-picker"

export default async function DesignPage({
  params,
}: {
  params: { tributeId: string }
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId: session.user.id },
    include: { template: true },
  })

  if (!tribute) notFound()

  const templates = await prisma.designTemplate.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <nav className="border-b border-[#d4c5a9] px-6 py-4">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <img src="/logo.png" alt="Love Cards" className="h-[200px]" />
          </Link>
        </div>
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
            href={`/dashboard/${tribute.id}`}
            className="text-xs tracking-[2px] uppercase text-[#8b7355]"
          >
            ← Back
          </Link>
          <span className="text-xs text-[#ccc]">|</span>
          <span className="text-xs tracking-[2px] uppercase text-[#666]">
            Choose a Design
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-normal text-[#1a1a1a] mb-2">Card Design</h1>
        <p className="text-sm text-[#666] mb-8">
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
