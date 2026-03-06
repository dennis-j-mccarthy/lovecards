import Link from "next/link"
import { auth } from "@/lib/auth"
import { MemoryGrid } from "@/components/memory-grid"
import { ProductMockup } from "@/components/product-mockup"

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Nav */}
      <nav className="border-b border-[#d4c5a9] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[3px] uppercase text-[#8b7355]">Love Cards</p>
          </div>
          <div className="flex items-center gap-6">
            {session ? (
              <Link
                href="/dashboard"
                className="text-sm text-[#2d2d2d] hover:text-[#8b7355] transition-colors"
              >
                My Tributes
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="text-sm text-[#2d2d2d] hover:text-[#8b7355] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero — centered headline */}
      <section className="text-center px-6 pt-16 pb-10 max-w-3xl mx-auto">
        <p className="text-xs tracking-[4px] uppercase text-[#8b7355] mb-6">
          For birthdays · retirements · anniversaries
        </p>
        <h1 className="text-5xl md:text-6xl font-normal leading-[1.15] text-[#1a1a1a] mb-6">
          Everyone who loves them.<br />
          <span className="italic">All in one box.</span>
        </h1>
        <p className="text-lg text-[#666] leading-relaxed mb-8 max-w-xl mx-auto">
          You invite their people. Each person writes a message or shares a photo.
          We print every one as a beautiful card and deliver them in a keepsake box —
          so they can hold, read, and keep every word.
        </p>
        <Link
          href={session ? "/checkout" : "/sign-in?callbackUrl=/checkout"}
          className="inline-block bg-[#1a1a1a] text-white px-10 py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors"
        >
          Start a Collection — $99
        </Link>
        <p className="text-xs text-[#999] mt-3">
          Unlimited contributors · printed on premium card stock · free shipping
        </p>
      </section>

      {/* Product Mockup — the physical box */}
      <section className="bg-[#0f0c07] py-16 px-6 overflow-hidden">
        <p className="text-xs tracking-[4px] uppercase text-[#c9a96e] text-center mb-1 opacity-70">
          The Keepsake Box
        </p>
        <h2 className="text-2xl font-normal text-[#f0e8d8] text-center mb-0">
          Every word. Printed. Boxed. Delivered.
        </h2>
        <ProductMockup />
        <p className="text-xs text-[#c9a96e] text-center opacity-40 -mt-2">
          Premium card stock · Branded keepsake box · Free shipping
        </p>
      </section>

      {/* Full-width memory grid */}
      <section className="px-4 pb-6 pt-10">
        <p className="text-xs tracking-[2px] uppercase text-[#bbb] text-center mb-3">
          The kinds of things people say ↓
        </p>
        <MemoryGrid />
        <p className="text-xs text-[#ccc] text-center mt-3">
          Every card is one person&apos;s message — imagine a whole box of them.
        </p>
      </section>

      {/* How it works */}
      <section className="border-t border-[#d4c5a9] py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[3px] uppercase text-[#8b7355] text-center mb-2">
            How It Works
          </p>
          <h2 className="text-3xl font-normal text-[#1a1a1a] text-center mb-14">
            Simple for you. Unforgettable for them.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              {
                step: "01",
                title: "Start the Collection",
                body: "Tell us who you're celebrating — their name, a photo, and your own message to kick things off.",
              },
              {
                step: "02",
                title: "Invite Everyone",
                body: "Send a link via email or share it anywhere. No account needed — contributors just click and write.",
              },
              {
                step: "03",
                title: "AI Designs the Cards",
                body: "Claude arranges every message and photo into a beautiful printed card layout. Preview and revise freely.",
              },
              {
                step: "04",
                title: "We Print & Ship",
                body: "Cards printed on premium stock, packaged in a beautiful keepsake box — delivered to their door.",
              },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p className="text-4xl font-normal text-[#e8ddd0] mb-3">{step}</p>
                <h3 className="text-base font-normal text-[#1a1a1a] mb-2">{title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#d4c5a9] py-20 px-6 text-center bg-[#faf9f7]">
        <p className="text-xs tracking-[3px] uppercase text-[#8b7355] mb-4">The gift that says everything</p>
        <h2 className="text-3xl font-normal text-[#1a1a1a] mb-3">
          Show them how many people love them.
        </h2>
        <p className="text-sm text-[#999] mb-8 max-w-md mx-auto">
          One flat fee. Unlimited contributors. A keepsake box they&apos;ll keep forever.
        </p>
        <Link
          href={session ? "/checkout" : "/sign-in?callbackUrl=/checkout"}
          className="inline-block bg-[#1a1a1a] text-white px-10 py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors"
        >
          Get Started — $99
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#d4c5a9] py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-[#bbb]">
            &copy; {new Date().getFullYear()} Love Cards. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
