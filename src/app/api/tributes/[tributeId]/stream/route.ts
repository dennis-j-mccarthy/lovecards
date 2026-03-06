import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { toPublicContribution } from "@/types/tribute"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Verify ownership
  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId: session.user.id },
  })

  if (!tribute) {
    return new Response("Not found", { status: 404 })
  }

  const encoder = new TextEncoder()
  let lastChecked = new Date()
  let intervalId: ReturnType<typeof setInterval>

  const stream = new ReadableStream({
    start(controller) {
      // Initial heartbeat
      controller.enqueue(encoder.encode(": heartbeat\n\n"))

      intervalId = setInterval(async () => {
        try {
          const newContributions = await prisma.contribution.findMany({
            where: {
              tributeId: params.tributeId,
              createdAt: { gt: lastChecked },
              status: "APPROVED",
            },
            orderBy: { createdAt: "asc" },
          })

          if (newContributions.length > 0) {
            lastChecked = new Date()
            const payload = JSON.stringify(newContributions.map(toPublicContribution))
            controller.enqueue(
              encoder.encode(`event: contributions\ndata: ${payload}\n\n`)
            )
          }

          // Also stream tribute status changes (for PDF generation progress)
          const currentTribute = await prisma.tribute.findUnique({
            where: { id: params.tributeId },
            select: { status: true, pdfUrl: true },
          })

          if (currentTribute) {
            controller.enqueue(
              encoder.encode(
                `event: status\ndata: ${JSON.stringify(currentTribute)}\n\n`
              )
            )
          }

          // Heartbeat to keep connection alive
          controller.enqueue(encoder.encode(": heartbeat\n\n"))
        } catch {
          controller.close()
          clearInterval(intervalId)
        }
      }, 3000)
    },
    cancel() {
      clearInterval(intervalId)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
