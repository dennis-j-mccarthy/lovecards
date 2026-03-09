import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { signInWithEmail } from "./actions"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string }
}) {
  const session = await auth()
  if (session) {
    redirect(searchParams.callbackUrl ?? "/dashboard")
  }

  const callbackUrl = searchParams.callbackUrl ?? "/dashboard"

  return (
    <div className="min-h-screen bg-[#faf9f7] grid place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Love Cards" className="h-[200px] mx-auto mb-4" />
          <h1 className="text-2xl font-normal text-[#1a1a1a]">Sign In</h1>
          <p className="text-sm text-[#666] mt-2">
            To create and manage your tribute pages
          </p>
        </div>

        {searchParams.error && (
          <div className="mb-6 p-3 border border-red-200 bg-red-50 text-red-700 text-sm text-center">
            Sign in failed. Please try again.
          </div>
        )}

        <div className="space-y-3">
          {/* Magic link email */}
          <form action={signInWithEmail.bind(null, callbackUrl)}>
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="w-full border border-[#d4c5a9] bg-white px-4 py-3 text-sm text-[#2d2d2d] outline-none focus:border-[#8b7355] mb-2"
            />
            <button
              type="submit"
              className="w-full bg-[#1a1a1a] text-white px-4 py-3 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors"
            >
              Send Magic Link
            </button>
          </form>
        </div>

        <p className="text-xs text-[#999] text-center mt-6">
          No account needed for contributors — they use invitation links.
        </p>
      </div>
    </div>
  )
}
