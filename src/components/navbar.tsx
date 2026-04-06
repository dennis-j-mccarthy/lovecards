"use client"

import Link from "next/link"
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"

export function Navbar() {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <nav className="border-b border-[#e5e7eb] px-6 py-4 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <img src="/logo.png" alt="Love Cards" className="h-60" />
        </Link>
        <div className="flex items-center gap-6">
          {!isLoaded ? null : isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                My Love Card Boxes
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="redirect">
                <button className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button
                  className="text-lg font-medium text-white px-6 py-3 rounded-lg transition-all hover:brightness-110"
                  style={{
                    background: 'linear-gradient(135deg, #800020 0%, #5c0018 100%)',
                  }}
                >
                  Create Account
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
