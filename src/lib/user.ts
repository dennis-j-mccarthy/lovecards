import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

/**
 * Gets the authenticated Clerk user's DB record, creating one if it doesn't exist.
 * Returns null if not authenticated.
 */
export async function getDbUser() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null

  // Try to find existing user by clerkId
  const existing = await prisma.user.findUnique({ where: { clerkId } })
  if (existing) return existing

  // First time — fetch profile from Clerk and create DB record
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email =
    clerkUser.emailAddresses?.[0]?.emailAddress ?? `${clerkId}@clerk.user`
  const name = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ") || null

  return prisma.user.create({
    data: {
      clerkId,
      email,
      name,
      image: clerkUser.imageUrl,
    },
  })
}

/**
 * Gets the authenticated user's DB id, creating the user if needed.
 * Returns null if not authenticated.
 */
export async function getDbUserId() {
  const user = await getDbUser()
  return user?.id ?? null
}
