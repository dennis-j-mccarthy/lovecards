import Link from "next/link"
import Image from "next/image"
import { currentUser } from "@clerk/nextjs/server"
import { CardFan } from "@/components/card-fan"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"

export default async function HomePage() {
  const user = await currentUser()

  return (
    <div className="min-h-screen bg-white">

      {/* Hero — 3-column: sentimental image | explainer + CTA | card fan */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 40%, #f3f4f6 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20">
          {/* Desktop: 2 columns */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: headline + explainer + CTA */}
            <div className="text-center lg:text-left px-2">
              <p className="text-xs tracking-[4px] uppercase text-[#800020] mb-5">
                Show them how you love them
              </p>
              <h1 className="text-4xl xl:text-5xl font-normal leading-[1.15] text-[#111827] mb-5">
                Everyone who loves them.<br />
                <span className="italic">All in one box.</span>
              </h1>
              <p className="text-base text-gray-500 leading-relaxed mb-6 max-w-md">
                You invite their people. Each person shares a heartfelt memory, a favorite
                quote or passage, or a photo. We print every one as a beautiful card and deliver
                them in a keepsake box — so they can hold, read, and keep every word.
              </p>
              <Link
                href={user ? "/checkout" : "/sign-in?redirect_url=/checkout"}
                className="inline-block text-white px-10 py-4 text-sm font-medium tracking-wide uppercase rounded-lg transition-all hover:brightness-110 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #800020 0%, #5c0018 100%)',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                }}
              >
                Start a Love Card Box — $49
              </Link>
              <p className="text-xs text-gray-400 mt-3">
                Unlimited contributors · premium card stock · free shipping
              </p>
            </div>

            {/* Right: hero image */}
            <div className="flex justify-center">
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-30"
                  style={{ background: 'radial-gradient(circle, #fce7eb 0%, transparent 70%)' }}
                />
                <div className="relative" style={{ width: 400, height: 400 }}>
                  <Image
                    src="/hero-center.png"
                    alt="A hand lifting a 'You are Loved' card from a keepsake box"
                    fill
                    className="object-cover rounded-2xl"
                    sizes="400px"
                    priority
                    quality={90}
                    style={{ boxShadow: '0 20px 60px rgba(99,102,241,0.15), 0 4px 16px rgba(0,0,0,0.06)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tablet: 2 columns (text + card fan) */}
          <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-xs tracking-[4px] uppercase text-[#800020] mb-5">
                Show them how you love them
              </p>
              <h1 className="text-4xl font-normal leading-[1.15] text-[#111827] mb-5">
                Everyone who loves them.<br />
                <span className="italic">All in one box.</span>
              </h1>
              <p className="text-base text-gray-500 leading-relaxed mb-5">
                You invite their people. Each person shares a heartfelt memory, a favorite
                quote or passage, or a photo. We print every one as a beautiful card and deliver
                them in a keepsake box — so they can hold, read, and keep every word.
              </p>
              <div className="flex justify-start mb-5">
                <div className="relative" style={{ width: 180, height: 107 }}>
                  <Image
                    src="/love-cards-box.png"
                    alt="The Love Cards keepsake box"
                    fill
                    className="object-contain drop-shadow-lg"
                    sizes="180px"
                  />
                </div>
              </div>
              <Link
                href={user ? "/checkout" : "/sign-in?redirect_url=/checkout"}
                className="inline-block text-white px-10 py-4 text-sm font-medium tracking-wide uppercase rounded-lg transition-all hover:brightness-110 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #800020 0%, #5c0018 100%)',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                }}
              >
                Start a Love Card Box — $49
              </Link>
              <p className="text-xs text-gray-400 mt-3">
                Unlimited contributors · premium card stock · free shipping
              </p>
            </div>
            <div className="flex justify-center">
              <CardFan />
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="md:hidden text-center">
            <p className="text-xs tracking-[4px] uppercase text-[#800020] mb-5">
              Show them how you love them
            </p>
            <h1 className="text-4xl font-normal leading-[1.15] text-[#111827] mb-5">
              Everyone who loves them.<br />
              <span className="italic">All in one box.</span>
            </h1>
            <p className="text-base text-gray-500 leading-relaxed mb-5 max-w-md mx-auto">
              You invite their people. Each person shares a heartfelt memory, a favorite
              quote or passage, or a photo. We print every one as a beautiful card and deliver
              them in a keepsake box — so they can hold, read, and keep every word.
            </p>
            <div className="flex justify-center mb-5">
              <div className="relative" style={{ width: 200, height: 119 }}>
                <Image
                  src="/love-cards-box.png"
                  alt="The Love Cards keepsake box"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="200px"
                />
              </div>
            </div>
            <Link
              href={user ? "/checkout" : "/sign-in?redirect_url=/checkout"}
              className="inline-block text-white px-10 py-4 text-sm font-medium tracking-wide uppercase rounded-lg transition-all hover:brightness-110 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #800020 0%, #5c0018 100%)',
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              }}
            >
              Start a Love Card Box — $49
            </Link>
            <p className="text-xs text-gray-400 mt-3">
              Unlimited contributors · premium card stock · free shipping
            </p>
            <div className="mt-6 flex justify-center">
              <CardFan />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #f3f4f6 50%, #fdf2f4 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[4px] uppercase text-center mb-3" style={{ color: '#800020' }}>
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-normal text-[#111827] text-center mb-4">
            Four easy steps. We guide you the whole way.
          </h2>
          <p className="text-base text-gray-400 text-center mb-16 max-w-lg mx-auto">
            Dead simple for you, even simpler for contributors — no account needed, no app to download.
          </p>

          {/* Desktop: horizontal timeline with arrows */}
          <div className="hidden md:block">
            {/* Step circles + connecting arrows */}
            <div className="flex items-center justify-between mb-8 px-8">
              {([
                { num: 1, gradient: 'linear-gradient(135deg, #800020 0%, #5c0018 100%)', shadow: 'rgba(99,102,241,0.3)' },
                { num: 2, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', shadow: 'rgba(139,92,246,0.3)' },
                { num: 3, gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', shadow: 'rgba(20,184,166,0.3)' },
                { num: 4, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', shadow: 'rgba(59,130,246,0.3)' },
              ] as const).map(({ num, gradient, shadow }, i) => (
                <div key={num} className="contents">
                  <div className="flex flex-col items-center" style={{ flex: '0 0 auto' }}>
                    <div
                      className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-[22px] font-semibold text-white"
                      style={{
                        background: gradient,
                        boxShadow: `0 6px 24px ${shadow}, inset 0 1px 0 rgba(255,255,255,0.25)`,
                      }}
                    >
                      {num}
                    </div>
                  </div>
                  {i < 3 && (
                    <div className="flex-1 flex items-center justify-center px-3">
                      <div className="flex items-center w-full">
                        <div
                          className="flex-1 h-[3px] rounded-full"
                          style={{
                            background: [
                              'linear-gradient(90deg, #800020, #8b5cf6)',
                              'linear-gradient(90deg, #8b5cf6, #14b8a6)',
                              'linear-gradient(90deg, #14b8a6, #3b82f6)',
                            ][i],
                            opacity: 0.5,
                          }}
                        />
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 -ml-[2px]">
                          <path
                            d="M3 9h12M11 5l4 4-4 4"
                            stroke={['#8b5cf6', '#14b8a6', '#3b82f6'][i]}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.6"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Step content cards */}
            <div className="grid grid-cols-4 gap-5 px-2">
              {([
                {
                  color: '#800020',
                  bgFrom: '#fdf2f4',
                  bgTo: '#fce7eb',
                  borderColor: '#f9a8b8',
                  iconBg: '#fce7eb',
                  icon: (
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <circle cx="15" cy="11" r="4" stroke="#800020" strokeWidth="1.8"/>
                      <path d="M8 23c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#800020" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M21 8v5M18.5 10.5h5" stroke="#800020" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ),
                  title: "Sign Up & Create",
                  body: "Tell us who you're celebrating.",
                  tag: "Takes 2 minutes",
                },
                {
                  color: '#8b5cf6',
                  bgFrom: '#f5f3ff',
                  bgTo: '#ede9fe',
                  borderColor: '#c4b5fd',
                  iconBg: '#ede9fe',
                  icon: (
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M5 8.5h20c.828 0 1.5.672 1.5 1.5v10c0 .828-.672 1.5-1.5 1.5H5c-.828 0-1.5-.672-1.5-1.5V10c0-.828.672-1.5 1.5-1.5z" stroke="#8b5cf6" strokeWidth="1.8"/>
                      <path d="M3.5 10l11.5 7 11.5-7" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="22" cy="8" r="4" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5"/>
                      <path d="M22 6v4M20 8h4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  title: "Invite Loved Ones",
                  body: "Share a link via email, text, or social. Contributors just click and write — no signup, no app, no friction.",
                  tag: "No account needed",
                },
                {
                  color: '#14b8a6',
                  bgFrom: '#f0fdfa',
                  bgTo: '#ccfbf1',
                  borderColor: '#99f6e4',
                  iconBg: '#ccfbf1',
                  icon: (
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <rect x="4" y="5" width="15" height="20" rx="2" stroke="#14b8a6" strokeWidth="1.8"/>
                      <rect x="11" y="5" width="15" height="20" rx="2" stroke="#14b8a6" strokeWidth="1.8" fill="#f0fdfa"/>
                      <path d="M15 12h7M15 15.5h7M15 19h5" stroke="#14b8a6" strokeWidth="1.4" strokeLinecap="round"/>
                      <circle cx="8" cy="22" r="4" fill="#ccfbf1" stroke="#14b8a6" strokeWidth="1.5"/>
                      <path d="M6.5 22l1 1 2.5-2.5" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: "Review & Preview",
                  body: "Watch messages arrive in real time. AI designs each card beautifully. Preview everything before printing.",
                  tag: "Full control",
                },
                {
                  color: '#3b82f6',
                  bgFrom: '#eff6ff',
                  bgTo: '#dbeafe',
                  borderColor: '#93c5fd',
                  iconBg: '#dbeafe',
                  icon: (
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M4 21l11 5 11-5v-7" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 14l11 5 11-5L15 9 4 14z" stroke="#3b82f6" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M15 19v6" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M10 4l2 2.5L10 9" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                      <path d="M20 4l-2 2.5L20 9" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                      <circle cx="15" cy="6" r="1.5" fill="#5478bf" opacity="0.3"/>
                    </svg>
                  ),
                  title: "We Print & Deliver",
                  body: "Premium cards, beautiful keepsake box, delivered to their door. A gift they'll hold onto forever.",
                  tag: "Free shipping",
                },
              ] as const).map(({ color, bgFrom, bgTo, borderColor, iconBg, icon, title, body, tag }, i) => (
                <div
                  key={i}
                  className="text-center rounded-2xl p-6 pt-7"
                  style={{
                    background: `linear-gradient(180deg, ${bgFrom} 0%, ${bgTo} 100%)`,
                    border: `1.5px solid ${borderColor}`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: iconBg }}
                  >
                    {icon}
                  </div>
                  <h3 className="text-[15px] font-semibold mb-2" style={{ color }}>{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{body}</p>
                  <span
                    className="inline-block text-[11px] font-medium tracking-[0.5px] uppercase px-4 py-1.5 rounded-full"
                    style={{
                      background: iconBg,
                      color,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden space-y-0">
            {([
              {
                num: 1,
                color: '#800020',
                gradient: 'linear-gradient(135deg, #800020 0%, #5c0018 100%)',
                shadow: 'rgba(99,102,241,0.3)',
                bgFrom: '#fdf2f4',
                bgTo: '#fce7eb',
                borderColor: '#f9a8b8',
                iconBg: '#fce7eb',
                lineGradient: 'linear-gradient(180deg, #800020, #8b5cf6)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
                    <circle cx="15" cy="11" r="4" stroke="#800020" strokeWidth="1.8"/>
                    <path d="M8 23c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#800020" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M21 8v5M18.5 10.5h5" stroke="#800020" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Sign Up & Create",
                body: "Tell us who you're celebrating.",
                tag: "Takes 2 minutes",
              },
              {
                num: 2,
                color: '#8b5cf6',
                gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                shadow: 'rgba(139,92,246,0.3)',
                bgFrom: '#f5f3ff',
                bgTo: '#ede9fe',
                borderColor: '#c4b5fd',
                iconBg: '#ede9fe',
                lineGradient: 'linear-gradient(180deg, #8b5cf6, #14b8a6)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
                    <path d="M5 8.5h20c.828 0 1.5.672 1.5 1.5v10c0 .828-.672 1.5-1.5 1.5H5c-.828 0-1.5-.672-1.5-1.5V10c0-.828.672-1.5 1.5-1.5z" stroke="#8b5cf6" strokeWidth="1.8"/>
                    <path d="M3.5 10l11.5 7 11.5-7" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: "Invite Loved Ones",
                body: "Share a link via email, text, or social. No signup needed — contributors just click and write.",
                tag: "No account needed",
              },
              {
                num: 3,
                color: '#14b8a6',
                gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                shadow: 'rgba(20,184,166,0.3)',
                bgFrom: '#f0fdfa',
                bgTo: '#ccfbf1',
                borderColor: '#99f6e4',
                iconBg: '#ccfbf1',
                lineGradient: 'linear-gradient(180deg, #14b8a6, #3b82f6)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
                    <rect x="4" y="5" width="15" height="20" rx="2" stroke="#14b8a6" strokeWidth="1.8"/>
                    <rect x="11" y="5" width="15" height="20" rx="2" stroke="#14b8a6" strokeWidth="1.8" fill="#f0fdfa"/>
                    <path d="M15 12h7M15 15.5h7M15 19h5" stroke="#14b8a6" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Review & Preview",
                body: "Watch messages arrive. AI designs each card beautifully. Preview everything before printing.",
                tag: "Full control",
              },
              {
                num: 4,
                color: '#3b82f6',
                gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                shadow: 'rgba(59,130,246,0.3)',
                bgFrom: '#eff6ff',
                bgTo: '#dbeafe',
                borderColor: '#93c5fd',
                iconBg: '#dbeafe',
                lineGradient: '',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
                    <path d="M4 21l11 5 11-5v-7" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 14l11 5 11-5L15 9 4 14z" stroke="#3b82f6" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M15 19v6" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: "We Print & Deliver",
                body: "Premium cards, beautiful keepsake box, delivered to their door. A gift they'll keep forever.",
                tag: "Free shipping",
              },
            ] as const).map(({ num, color, gradient, shadow, bgFrom, bgTo, borderColor, iconBg, lineGradient, icon, title, body, tag }, i) => (
              <div key={num} className="flex gap-4">
                {/* Vertical line + circle */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold text-white flex-shrink-0"
                    style={{
                      background: gradient,
                      boxShadow: `0 4px 16px ${shadow}`,
                    }}
                  >
                    {num}
                  </div>
                  {i < 3 && (
                    <div
                      className="w-[3px] flex-1 my-1 rounded-full"
                      style={{ background: lineGradient, opacity: 0.4 }}
                    />
                  )}
                </div>
                {/* Content */}
                <div
                  className="flex-1 rounded-xl p-4 mb-4"
                  style={{
                    background: `linear-gradient(180deg, ${bgFrom} 0%, ${bgTo} 100%)`,
                    border: `1.5px solid ${borderColor}`,
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: iconBg }}
                    >
                      {icon}
                    </div>
                    <h3 className="text-[15px] font-semibold" style={{ color }}>{title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-2.5">{body}</p>
                  <span
                    className="inline-block text-[10px] font-medium tracking-[0.5px] uppercase px-3 py-1 rounded-full"
                    style={{
                      background: iconBg,
                      color,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    {tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[4px] uppercase text-center text-[#800020] mb-3">
            What People Are Saying
          </p>
          <h2 className="text-3xl md:text-4xl font-normal text-[#111827] text-center mb-12">
            Real stories from real people.
          </h2>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#e5e7eb] py-20 px-6 text-center bg-white">
        <p className="text-xs tracking-[3px] uppercase text-[#800020] mb-4">The gift that says everything</p>
        <h2 className="text-3xl font-normal text-[#111827] mb-3">
          Show them how many people love them.
        </h2>
        <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
          One flat fee. Unlimited contributors. A keepsake box they&apos;ll keep forever.
        </p>
        <Link
          href={user ? "/checkout" : "/sign-in?redirect_url=/checkout"}
          className="inline-block text-white px-10 py-4 text-sm font-medium tracking-wide uppercase rounded-lg transition-all hover:brightness-110 hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #800020 0%, #5c0018 100%)',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}
        >
          Start a Love Card Box — $49
        </Link>
        <p className="text-xs text-gray-300 mt-4">
          Unlimited contributors · premium card stock · free shipping
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e7eb] py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-gray-300">
            &copy; {new Date().getFullYear()} Love Cards. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
