import Link from "next/link"
import Image from "next/image"
import { auth } from "@/lib/auth"
import { CardFan } from "@/components/card-fan"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"

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

      {/* Hero — 3-column: sentimental image | explainer + CTA | card fan */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #faf9f7 0%, #fdf6ef 40%, #f9ede0 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20">
          {/* Desktop: 3 columns */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_minmax(380px,460px)_1fr] gap-8 items-center">

            {/* Left: sentimental photo */}
            <div className="flex justify-center">
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-30"
                  style={{ background: 'radial-gradient(circle, #f0d5b8 0%, transparent 70%)' }}
                />
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    width: 280,
                    height: 350,
                    boxShadow: '0 20px 60px rgba(139,115,85,0.22), 0 4px 16px rgba(0,0,0,0.08)',
                  }}
                >
                  <Image
                    src="/love-card-hero.jpg"
                    alt="A woman reading a heartfelt card with her hand on her heart"
                    fill
                    className="object-cover"
                    sizes="280px"
                    priority
                    quality={90}
                  />
                </div>
                <p className="text-center text-xs text-[#b8a080] mt-3 italic">
                  &ldquo;I&apos;ve never felt so loved in my entire life.&rdquo;
                </p>
              </div>
            </div>

            {/* Center: headline + explainer + box + CTA */}
            <div className="text-center px-2">
              <p className="text-xs tracking-[4px] uppercase text-[#8b7355] mb-5">
                Show them how you love them
              </p>
              <h1 className="text-4xl xl:text-5xl font-normal leading-[1.15] text-[#1a1a1a] mb-5">
                Everyone who loves them.<br />
                <span className="italic">All in one box.</span>
              </h1>
              <p className="text-base text-[#666] leading-relaxed mb-6 max-w-md mx-auto">
                You invite their people. Each person shares a heartfelt memory, a favorite
                quote or passage, or a photo. We print every one as a beautiful card and deliver
                them in a keepsake box — so they can hold, read, and keep every word.
              </p>
              {/* Keepsake box image */}
              <div className="flex justify-center mb-6">
                <div className="relative" style={{ width: 220, height: 130 }}>
                  <Image
                    src="/love-cards-box.png"
                    alt="The Love Cards keepsake box"
                    fill
                    className="object-contain drop-shadow-lg"
                    sizes="220px"
                  />
                </div>
              </div>
              <Link
                href={session ? "/checkout" : "/sign-in?callbackUrl=/checkout"}
                className="inline-block text-white px-10 py-4 text-sm tracking-[1px] uppercase transition-all hover:brightness-110 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #e8785e 0%, #d4593f 100%)',
                  boxShadow: '0 4px 16px rgba(232,120,94,0.35)',
                }}
              >
                Start a Card Box — $49
              </Link>
              <p className="text-xs text-[#999] mt-3">
                Unlimited contributors · premium card stock · free shipping
              </p>
            </div>

            {/* Right: card fan */}
            <div className="flex justify-center">
              <CardFan />
            </div>
          </div>

          {/* Tablet: 2 columns (text + card fan) */}
          <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-xs tracking-[4px] uppercase text-[#8b7355] mb-5">
                Show them how you love them
              </p>
              <h1 className="text-4xl font-normal leading-[1.15] text-[#1a1a1a] mb-5">
                Everyone who loves them.<br />
                <span className="italic">All in one box.</span>
              </h1>
              <p className="text-base text-[#666] leading-relaxed mb-5">
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
                href={session ? "/checkout" : "/sign-in?callbackUrl=/checkout"}
                className="inline-block text-white px-10 py-4 text-sm tracking-[1px] uppercase transition-all hover:brightness-110 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #e8785e 0%, #d4593f 100%)',
                  boxShadow: '0 4px 16px rgba(232,120,94,0.35)',
                }}
              >
                Start a Card Box — $49
              </Link>
              <p className="text-xs text-[#999] mt-3">
                Unlimited contributors · premium card stock · free shipping
              </p>
            </div>
            <div className="flex justify-center">
              <CardFan />
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="md:hidden text-center">
            <p className="text-xs tracking-[4px] uppercase text-[#8b7355] mb-5">
              Show them how you love them
            </p>
            <h1 className="text-4xl font-normal leading-[1.15] text-[#1a1a1a] mb-5">
              Everyone who loves them.<br />
              <span className="italic">All in one box.</span>
            </h1>
            <p className="text-base text-[#666] leading-relaxed mb-5 max-w-md mx-auto">
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
              href={session ? "/checkout" : "/sign-in?callbackUrl=/checkout"}
              className="inline-block text-white px-10 py-4 text-sm tracking-[1px] uppercase transition-all hover:brightness-110 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #e8785e 0%, #d4593f 100%)',
                boxShadow: '0 4px 16px rgba(232,120,94,0.35)',
              }}
            >
              Start a Card Box — $49
            </Link>
            <p className="text-xs text-[#999] mt-3">
              Unlimited contributors · premium card stock · free shipping
            </p>
            <div className="mt-6 flex justify-center">
              <CardFan />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #fffbf5 0%, #fff5eb 50%, #fef0e4 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[4px] uppercase text-center mb-3" style={{ color: '#c2703e' }}>
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1a1a1a] text-center mb-4">
            Four easy steps. We guide you the whole way.
          </h2>
          <p className="text-base text-[#888] text-center mb-16 max-w-lg mx-auto">
            Dead simple for you, even simpler for contributors — no account needed, no app to download.
          </p>

          {/* Desktop: horizontal timeline with arrows */}
          <div className="hidden md:block">
            {/* Step circles + connecting arrows */}
            <div className="flex items-center justify-between mb-8 px-8">
              {([
                { num: 1, gradient: 'linear-gradient(135deg, #e8785e 0%, #d4593f 100%)', shadow: 'rgba(232,120,94,0.4)' },
                { num: 2, gradient: 'linear-gradient(135deg, #e6a644 0%, #d4922e 100%)', shadow: 'rgba(230,166,68,0.4)' },
                { num: 3, gradient: 'linear-gradient(135deg, #5ba887 0%, #479474 100%)', shadow: 'rgba(91,168,135,0.4)' },
                { num: 4, gradient: 'linear-gradient(135deg, #6b8fd4 0%, #5478bf 100%)', shadow: 'rgba(107,143,212,0.4)' },
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
                              'linear-gradient(90deg, #e8785e, #e6a644)',
                              'linear-gradient(90deg, #e6a644, #5ba887)',
                              'linear-gradient(90deg, #5ba887, #6b8fd4)',
                            ][i],
                            opacity: 0.5,
                          }}
                        />
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 -ml-[2px]">
                          <path
                            d="M3 9h12M11 5l4 4-4 4"
                            stroke={['#e6a644', '#5ba887', '#6b8fd4'][i]}
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
                  color: '#e8785e',
                  bgFrom: '#fff5f3',
                  bgTo: '#ffefeb',
                  borderColor: '#f5cdc4',
                  iconBg: '#fde8e3',
                  icon: (
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <circle cx="15" cy="11" r="4" stroke="#e8785e" strokeWidth="1.8"/>
                      <path d="M8 23c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#e8785e" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M21 8v5M18.5 10.5h5" stroke="#e8785e" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ),
                  title: "Sign Up & Create",
                  body: "Tell us who you're celebrating.",
                  tag: "Takes 2 minutes",
                },
                {
                  color: '#d4922e',
                  bgFrom: '#fff9f0',
                  bgTo: '#fff4e5',
                  borderColor: '#f0dbb8',
                  iconBg: '#fdf1db',
                  icon: (
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M5 8.5h20c.828 0 1.5.672 1.5 1.5v10c0 .828-.672 1.5-1.5 1.5H5c-.828 0-1.5-.672-1.5-1.5V10c0-.828.672-1.5 1.5-1.5z" stroke="#d4922e" strokeWidth="1.8"/>
                      <path d="M3.5 10l11.5 7 11.5-7" stroke="#d4922e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="22" cy="8" r="4" fill="#fff4e5" stroke="#d4922e" strokeWidth="1.5"/>
                      <path d="M22 6v4M20 8h4" stroke="#d4922e" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  title: "Invite Loved Ones",
                  body: "Share a link via email, text, or social. Contributors just click and write — no signup, no app, no friction.",
                  tag: "No account needed",
                },
                {
                  color: '#479474',
                  bgFrom: '#f0faf5',
                  bgTo: '#e5f5ee',
                  borderColor: '#b8dece',
                  iconBg: '#ddf3e8',
                  icon: (
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <rect x="4" y="5" width="15" height="20" rx="2" stroke="#479474" strokeWidth="1.8"/>
                      <rect x="11" y="5" width="15" height="20" rx="2" stroke="#479474" strokeWidth="1.8" fill="#f0faf5"/>
                      <path d="M15 12h7M15 15.5h7M15 19h5" stroke="#479474" strokeWidth="1.4" strokeLinecap="round"/>
                      <circle cx="8" cy="22" r="4" fill="#e5f5ee" stroke="#479474" strokeWidth="1.5"/>
                      <path d="M6.5 22l1 1 2.5-2.5" stroke="#479474" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: "Review & Preview",
                  body: "Watch messages arrive in real time. AI designs each card beautifully. Preview everything before printing.",
                  tag: "Full control",
                },
                {
                  color: '#5478bf',
                  bgFrom: '#f0f4fc',
                  bgTo: '#e5ecf8',
                  borderColor: '#b8ccee',
                  iconBg: '#dde6f8',
                  icon: (
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M4 21l11 5 11-5v-7" stroke="#5478bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 14l11 5 11-5L15 9 4 14z" stroke="#5478bf" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M15 19v6" stroke="#5478bf" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M10 4l2 2.5L10 9" stroke="#5478bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                      <path d="M20 4l-2 2.5L20 9" stroke="#5478bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
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
                  <p className="text-sm text-[#666] leading-relaxed mb-4">{body}</p>
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
                color: '#e8785e',
                gradient: 'linear-gradient(135deg, #e8785e 0%, #d4593f 100%)',
                shadow: 'rgba(232,120,94,0.35)',
                bgFrom: '#fff5f3',
                bgTo: '#ffefeb',
                borderColor: '#f5cdc4',
                iconBg: '#fde8e3',
                lineGradient: 'linear-gradient(180deg, #e8785e, #e6a644)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
                    <circle cx="15" cy="11" r="4" stroke="#e8785e" strokeWidth="1.8"/>
                    <path d="M8 23c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#e8785e" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M21 8v5M18.5 10.5h5" stroke="#e8785e" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Sign Up & Create",
                body: "Tell us who you're celebrating.",
                tag: "Takes 2 minutes",
              },
              {
                num: 2,
                color: '#d4922e',
                gradient: 'linear-gradient(135deg, #e6a644 0%, #d4922e 100%)',
                shadow: 'rgba(230,166,68,0.35)',
                bgFrom: '#fff9f0',
                bgTo: '#fff4e5',
                borderColor: '#f0dbb8',
                iconBg: '#fdf1db',
                lineGradient: 'linear-gradient(180deg, #e6a644, #5ba887)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
                    <path d="M5 8.5h20c.828 0 1.5.672 1.5 1.5v10c0 .828-.672 1.5-1.5 1.5H5c-.828 0-1.5-.672-1.5-1.5V10c0-.828.672-1.5 1.5-1.5z" stroke="#d4922e" strokeWidth="1.8"/>
                    <path d="M3.5 10l11.5 7 11.5-7" stroke="#d4922e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: "Invite Loved Ones",
                body: "Share a link via email, text, or social. No signup needed — contributors just click and write.",
                tag: "No account needed",
              },
              {
                num: 3,
                color: '#479474',
                gradient: 'linear-gradient(135deg, #5ba887 0%, #479474 100%)',
                shadow: 'rgba(91,168,135,0.35)',
                bgFrom: '#f0faf5',
                bgTo: '#e5f5ee',
                borderColor: '#b8dece',
                iconBg: '#ddf3e8',
                lineGradient: 'linear-gradient(180deg, #5ba887, #6b8fd4)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
                    <rect x="4" y="5" width="15" height="20" rx="2" stroke="#479474" strokeWidth="1.8"/>
                    <rect x="11" y="5" width="15" height="20" rx="2" stroke="#479474" strokeWidth="1.8" fill="#f0faf5"/>
                    <path d="M15 12h7M15 15.5h7M15 19h5" stroke="#479474" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Review & Preview",
                body: "Watch messages arrive. AI designs each card beautifully. Preview everything before printing.",
                tag: "Full control",
              },
              {
                num: 4,
                color: '#5478bf',
                gradient: 'linear-gradient(135deg, #6b8fd4 0%, #5478bf 100%)',
                shadow: 'rgba(107,143,212,0.35)',
                bgFrom: '#f0f4fc',
                bgTo: '#e5ecf8',
                borderColor: '#b8ccee',
                iconBg: '#dde6f8',
                lineGradient: '',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
                    <path d="M4 21l11 5 11-5v-7" stroke="#5478bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 14l11 5 11-5L15 9 4 14z" stroke="#5478bf" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M15 19v6" stroke="#5478bf" strokeWidth="1.8" strokeLinecap="round"/>
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
                  <p className="text-sm text-[#666] leading-relaxed mb-2.5">{body}</p>
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
      <section className="py-20 px-6 bg-[#faf9f7]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[4px] uppercase text-center text-[#8b7355] mb-3">
            What People Are Saying
          </p>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1a1a1a] text-center mb-12">
            Real stories from real people.
          </h2>
          <TestimonialsCarousel />
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
          className="inline-block text-white px-10 py-4 text-sm tracking-[1px] uppercase transition-all hover:brightness-110 hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #e8785e 0%, #d4593f 100%)',
            boxShadow: '0 4px 16px rgba(232,120,94,0.35)',
          }}
        >
          Start a Card Box — $49
        </Link>
        <p className="text-xs text-[#bbb] mt-4">
          Unlimited contributors · premium card stock · free shipping
        </p>
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
