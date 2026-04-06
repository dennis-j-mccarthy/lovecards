"use client"

type Testimonial = {
  quote: string
  name: string
  role: "Organizer" | "Contributor" | "Recipient"
  context: string
}

const testimonials: Testimonial[] = [
  {
    quote: "I sent the link to 30 people and within a week we had the most beautiful collection of messages. My mom sobbed when she opened the box. Best gift I've ever given.",
    name: "Rachel M.",
    role: "Organizer",
    context: "Mother's 70th birthday",
  },
  {
    quote: "I wasn't sure what to write at first, but once I started the words just poured out. It felt so good to finally tell my old coach how much he changed my life.",
    name: "Marcus T.",
    role: "Contributor",
    context: "Retirement celebration",
  },
  {
    quote: "I've never cried reading a card before. But reading thirty of them? I didn't know that many people even thought about me, let alone cared that deeply. I'll keep these forever.",
    name: "Sarah K.",
    role: "Recipient",
    context: "40th birthday",
  },
  {
    quote: "The whole process took me maybe five minutes to set up. My sister handled inviting people and two weeks later we had 45 cards. The quality of the printing is stunning.",
    name: "James L.",
    role: "Organizer",
    context: "Grandparents' anniversary",
  },
  {
    quote: "I wrote three different cards — one serious, one funny, and one with a photo from our road trip. It was so easy, and I love that I could contribute more than once.",
    name: "Priya N.",
    role: "Contributor",
    context: "Best friend's wedding",
  },
  {
    quote: "My daughter organized this for my retirement. Every morning I read a few cards with my coffee. Some make me laugh, some make me cry. It's the most personal gift I've ever received.",
    name: "Tom H.",
    role: "Recipient",
    context: "Retirement",
  },
  {
    quote: "We used it for a colleague who was going through treatment. The cards were a reminder that an entire community was pulling for her. She said they gave her strength on the hard days.",
    name: "Ana R.",
    role: "Organizer",
    context: "Support for a friend",
  },
  {
    quote: "I wasn't close enough to give a big gift, but I could write something honest. That felt like enough. That felt like more than enough, actually.",
    name: "David C.",
    role: "Contributor",
    context: "Farewell celebration",
  },
]

const roleColors: Record<Testimonial["role"], { bg: string; text: string; border: string }> = {
  Organizer: { bg: "#fff5f3", text: "#e8785e", border: "#f5cdc4" },
  Contributor: { bg: "#fff9f0", text: "#d4922e", border: "#f0dbb8" },
  Recipient: { bg: "#f0f4fc", text: "#5478bf", border: "#b8ccee" },
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const colors = roleColors[t.role]
  return (
    <div
      className="flex-shrink-0 w-[300px] border border-[#e5e7eb] bg-white p-6 flex flex-col gap-4"
      style={{ minHeight: 220 }}
    >
      <blockquote className="text-sm leading-relaxed text-[#1f2937] font-serif italic flex-1">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-[#111827]">{t.name}</p>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-medium tracking-[1px] uppercase px-3 py-1 rounded-full"
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            {t.role}
          </span>
          <span className="text-xs text-gray-400">{t.context}</span>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsCarousel() {
  // Render two copies for seamless infinite scroll
  const items = [...testimonials, ...testimonials]

  return (
    <div
      className="overflow-hidden group"
      style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
    >
      <div
        className="flex gap-5 group-hover:[animation-play-state:paused]"
        style={{
          animation: "marquee 50s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
