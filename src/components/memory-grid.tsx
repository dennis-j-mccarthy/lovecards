"use client"

import { useEffect, useState } from "react"

type MemoryCard =
  | { type: "quote"; text: string; name: string; bg: string; textColor: string }
  | { type: "photo"; emoji: string; caption: string; name: string; bg: string }
  | { type: "meme"; top: string; bottom: string; emoji: string; bg: string }
  | { type: "big-quote"; text: string; name: string; bg: string }
  | { type: "wisdom"; text: string; author: string; sharedBy: string; bg: string; accent: string }

const MEMORIES: MemoryCard[] = [
  // Personal memories — written *to* the person
  { type: "quote", text: "I will always be inspired by the way you walk into a room and make everyone feel like they matter.", name: "Sarah M.", bg: "#ffffff", textColor: "#1f2937" },
  { type: "photo", emoji: "🌻", caption: "Your garden taught me that patience and love grow the same way.", name: "James R.", bg: "#fdf2f4" },
  { type: "meme", top: "WHEN YOU SAID", bottom: '"I\'m proud of you"', emoji: "🥹", bg: "#111827" },
  { type: "quote", text: "You showed me that kindness costs nothing — and I carry that with me every single day.", name: "Tyler K.", bg: "#f0ebe0", textColor: "#1f2937" },
  { type: "photo", emoji: "☕", caption: "Those Sunday mornings with you are the ones I hold onto.", name: "Priya N.", bg: "#e8ddd0" },
  { type: "quote", text: "Your laugh has a way of making any room feel like home. I hope you know that.", name: "Elena W.", bg: "#ffffff", textColor: "#1f2937" },
  { type: "meme", top: "EVERY GATHERING IS", bottom: "better when you're there", emoji: "✨", bg: "#1f2937" },
  { type: "photo", emoji: "🎸", caption: "You taught me that music is how the soul speaks.", name: "Marcus T.", bg: "#fdf2f4" },
  { type: "quote", text: "You never missed a single game. Not one. I didn't understand then how much that meant. I do now.", name: "Claire B.", bg: "#ffffff", textColor: "#1f2937" },
  { type: "big-quote", text: "You are the reason I believe I can do anything.", name: "Ben C.", bg: "#800020" },
  { type: "photo", emoji: "🍰", caption: "Every birthday cake from scratch — that's love in flour and butter.", name: "Nora H.", bg: "#f0ebe0" },
  { type: "meme", top: "YOU'RE ALWAYS THE", bottom: "first call with good news", emoji: "📱", bg: "#111827" },
  { type: "quote", text: "Watching you love someone with that kind of steadiness — fifty years of it — has shaped everything I believe about commitment.", name: "Grace S.", bg: "#ffffff", textColor: "#1f2937" },
  { type: "photo", emoji: "🎣", caption: "Those summers at the lake are the ones I'll tell my kids about.", name: "Owen D.", bg: "#e8ddd0" },
  { type: "quote", text: "You believed in me before I could find it in myself. I want you to know — it changed everything.", name: "Noah G.", bg: "#fdf2f4", textColor: "#1f2937" },
  { type: "meme", top: "YOUR COOKING IS", bottom: "honestly life-changing", emoji: "👩‍🍳", bg: "#1f2937" },
  { type: "photo", emoji: "📚", caption: "You gave me a love of reading — and that is a gift without end.", name: "Isla J.", bg: "#ffffff" },
  { type: "quote", text: "You have a gift for finding beauty in ordinary moments. I will always be learning that from you.", name: "Zoe C.", bg: "#f0ebe0", textColor: "#1f2937" },
  { type: "photo", emoji: "🌅", caption: "You taught me that the best part of the day is before anyone else wakes up.", name: "Leo P.", bg: "#fdf2f4" },
  { type: "meme", top: "YOUR HUGS ARE", bottom: "genuinely medicinal", emoji: "🤗", bg: "#111827" },
  { type: "quote", text: "You hold this family together in ways most of us will never fully see. I see it. Thank you.", name: "Finn B.", bg: "#ffffff", textColor: "#1f2937" },
  { type: "photo", emoji: "🐶", caption: "Even the dog knows — you're the good one.", name: "Ava W.", bg: "#e8ddd0" },
  { type: "meme", top: "YOU TELL THE SAME JOKES", bottom: "and somehow still get me", emoji: "😂", bg: "#1f2937" },
  { type: "quote", text: "Your strength is the quiet kind — the kind that holds the rest of us up without ever asking for credit.", name: "Lily T.", bg: "#fdf2f4", textColor: "#1f2937" },
  { type: "photo", emoji: "✂️", caption: "Thirty years of showing up for people. That's who you are.", name: "Mia R.", bg: "#ffffff" },
  { type: "quote", text: "You always say 'I love you' before hanging up. I didn't realize how much I needed that until I noticed it.", name: "Caitlin O.", bg: "#f0ebe0", textColor: "#1f2937" },
  { type: "quote", text: "I will always be inspired by how your sense of fun and warmth draws people to you. You make life feel like a celebration.", name: "Tom V.", bg: "#e8ddd0", textColor: "#1f2937" },
  { type: "photo", emoji: "🌿", caption: "Your garden is proof that you tend to things with love — people included.", name: "Finn B.", bg: "#fdf2f4" },
  { type: "big-quote", text: "Every Sunday dinner is richer, warmer, and more alive because you're at the table.", name: "Rosa M.", bg: "#1f2937" },
  { type: "quote", text: "You can fix anything — but what I'll remember is that you always had time to try.", name: "David L.", bg: "#ffffff", textColor: "#1f2937" },
  { type: "photo", emoji: "🎬", caption: "Those Friday nights watching films together are some of my happiest memories.", name: "Sophie A.", bg: "#fdf2f4" },
  { type: "meme", top: "WHEN THAT SONG PLAYS", bottom: "I always think of you", emoji: "🎵", bg: "#1f2937" },

  // Wisdom — Rilke
  { type: "wisdom", text: "Once the realization is accepted that even between the closest human beings infinite distances continue, a wonderful living side by side can grow.", author: "Rainer Maria Rilke", sharedBy: "James R.", bg: "#1c1a16", accent: "#818cf8" },
  { type: "wisdom", text: "I live my life in widening circles that reach out across the world.", author: "Rainer Maria Rilke", sharedBy: "Elena W.", bg: "#fdf2f4", accent: "#800020" },
  { type: "wisdom", text: "Perhaps all the dragons in our lives are princesses who are only waiting to see us act, just once, with beauty and courage.", author: "Rainer Maria Rilke", sharedBy: "Noah G.", bg: "#1c1a16", accent: "#818cf8" },

  // Wisdom — Mary Oliver
  { type: "wisdom", text: "Tell me, what is it you plan to do with your one wild and precious life?", author: "Mary Oliver", sharedBy: "Priya N.", bg: "#2d3a2e", accent: "#a8c5a0" },
  { type: "wisdom", text: "You do not have to be good. You do not have to walk on your knees for a hundred miles through the desert repenting.", author: "Mary Oliver", sharedBy: "Claire B.", bg: "#f0ebe0", accent: "#6b8f5e" },
  { type: "wisdom", text: "Keep some room in your heart for the unimaginable.", author: "Mary Oliver", sharedBy: "Isla J.", bg: "#2d3a2e", accent: "#a8c5a0" },

  // Wisdom — Tolstoy
  { type: "wisdom", text: "If you want to be happy, be.", author: "Leo Tolstoy", sharedBy: "Marcus T.", bg: "#fdf2f4", accent: "#800020" },
  { type: "wisdom", text: "Everyone thinks of changing the world, but no one thinks of changing himself.", author: "Leo Tolstoy", sharedBy: "Grace S.", bg: "#1c1a16", accent: "#818cf8" },
  { type: "wisdom", text: "All, everything that I understand, I only understand because I love.", author: "Leo Tolstoy", sharedBy: "Nora H.", bg: "#fdf2f4", accent: "#800020" },

  // Wisdom — Scripture
  { type: "wisdom", text: "Love is patient, love is kind. It does not envy, it does not boast.", author: "1 Corinthians 13:4", sharedBy: "Rosa M.", bg: "#1c1a16", accent: "#818cf8" },
  { type: "wisdom", text: "Where you go I will go, and where you stay I will stay.", author: "Ruth 1:16", sharedBy: "Owen D.", bg: "#f0ebe0", accent: "#800020" },
  { type: "wisdom", text: "A friend loves at all times.", author: "Proverbs 17:17", sharedBy: "Lily T.", bg: "#2d3a2e", accent: "#a8c5a0" },

  // Wisdom — other great authors
  { type: "wisdom", text: "We are all leaves of one tree. We are all waves of one sea.", author: "Thich Nhat Hanh", sharedBy: "Finn B.", bg: "#2d3a2e", accent: "#a8c5a0" },
  { type: "wisdom", text: "The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.", author: "Helen Keller", sharedBy: "Sophie A.", bg: "#fdf2f4", accent: "#800020" },
  { type: "wisdom", text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", sharedBy: "Ben C.", bg: "#1c1a16", accent: "#818cf8" },
  { type: "wisdom", text: "The most important thing in the world is family and love.", author: "John Wooden", sharedBy: "Ava W.", bg: "#f0ebe0", accent: "#800020" },
  { type: "wisdom", text: "Joy is the simplest form of gratitude.", author: "Karl Barth", sharedBy: "Leo P.", bg: "#2d3a2e", accent: "#a8c5a0" },
  { type: "wisdom", text: "There is only one happiness in this life, to love and be loved.", author: "George Sand", sharedBy: "Mia R.", bg: "#1c1a16", accent: "#818cf8" },
  { type: "wisdom", text: "Life is the sum of all your choices.", author: "Albert Camus", sharedBy: "Tyler K.", bg: "#fdf2f4", accent: "#800020" },
  { type: "wisdom", text: "The giving of love is an education in itself.", author: "Eleanor Roosevelt", sharedBy: "Caitlin O.", bg: "#f0ebe0", accent: "#800020" },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Google Font CSS variables loaded in layout.tsx
const FONT_STYLES = [
  { font: "var(--font-playfair), serif",       weight: "normal", style: "normal" },
  { font: "var(--font-lora), serif",            weight: "normal", style: "italic" },
  { font: "var(--font-dancing), cursive",       weight: "normal", style: "normal" },
  { font: "var(--font-merriweather), serif",    weight: "300",    style: "normal" },
  { font: "var(--font-libre), serif",           weight: "400",    style: "normal" },
  { font: "var(--font-crimson), serif",         weight: "600",    style: "normal" },
  { font: "var(--font-garamond), serif",        weight: "normal", style: "italic" },
  { font: "var(--font-josefin), sans-serif",    weight: "normal", style: "normal" },
  { font: "var(--font-nunito), sans-serif",     weight: "normal", style: "normal" },
  { font: "var(--font-caveat), cursive",        weight: "normal", style: "normal" },
]

function getFontStyle(index: number) {
  return FONT_STYLES[index % FONT_STYLES.length]
}

function CardContent({ card, index }: { card: MemoryCard; index: number }) {
  const fontStyle = getFontStyle(index)

  if (card.type === "quote") {
    return (
      <div className="h-full flex flex-col items-center justify-center p-3 text-center" style={{ backgroundColor: card.bg }}>
        <p className="leading-snug overflow-hidden" style={{
          fontFamily: fontStyle.font,
          fontWeight: fontStyle.weight,
          fontStyle: fontStyle.style,
          color: card.textColor,
          fontSize: "clamp(12px, 1.5vw, 17px)",
          display: "-webkit-box",
          WebkitLineClamp: 6,
          WebkitBoxOrient: "vertical",
        }}>
          &ldquo;{card.text}&rdquo;
        </p>
        <p className="mt-2 truncate" style={{
          fontSize: "clamp(9px, 1vw, 12px)",
          color: "#800020",
          fontFamily: "var(--font-josefin), sans-serif",
          letterSpacing: "0.05em",
        }}>
          — {card.name}
        </p>
      </div>
    )
  }

  if (card.type === "big-quote") {
    return (
      <div className="h-full flex flex-col items-center justify-center p-3 text-center" style={{ backgroundColor: card.bg }}>
        <p className="leading-snug text-white overflow-hidden" style={{
          fontFamily: "var(--font-playfair), serif",
          fontStyle: "italic",
          fontSize: "clamp(13px, 1.6vw, 18px)",
          display: "-webkit-box",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
        }}>
          &ldquo;{card.text}&rdquo;
        </p>
        <p className="mt-3 text-white opacity-60 truncate" style={{
          fontSize: "clamp(9px, 1vw, 11px)",
          fontFamily: "var(--font-josefin), sans-serif",
          letterSpacing: "0.05em",
        }}>
          — {card.name}
        </p>
      </div>
    )
  }

  if (card.type === "wisdom") {
    return (
      <div className="h-full flex flex-col items-center justify-center p-3 text-center" style={{ backgroundColor: card.bg }}>
        <p className="mb-2" style={{ color: card.accent, opacity: 0.4, fontSize: "clamp(10px, 1.2vw, 14px)" }}>✦</p>
        <p className="leading-snug overflow-hidden" style={{
          fontFamily: fontStyle.font,
          fontStyle: "italic",
          fontWeight: fontStyle.weight,
          color: card.accent,
          fontSize: "clamp(12px, 1.4vw, 16px)",
          display: "-webkit-box",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
        }}>
          &ldquo;{card.text}&rdquo;
        </p>
        <p className="mt-2 tracking-widest truncate uppercase" style={{
          color: card.accent,
          opacity: 0.6,
          fontSize: "clamp(7px, 0.8vw, 10px)",
          fontFamily: "var(--font-josefin), sans-serif",
        }}>
          — {card.author}
        </p>
        <p className="mt-1 truncate" style={{
          color: card.accent,
          opacity: 0.4,
          fontSize: "clamp(7px, 0.75vw, 9px)",
          fontFamily: "var(--font-josefin), sans-serif",
          letterSpacing: "0.05em",
        }}>
          Shared by {card.sharedBy}
        </p>
      </div>
    )
  }

  if (card.type === "photo") {
    return (
      <div className="h-full flex flex-col items-center justify-center p-3 text-center" style={{ backgroundColor: card.bg }}>
        <div className="mb-2" style={{ fontSize: "clamp(28px, 4.5vw, 48px)" }}>{card.emoji}</div>
        <p className="text-[#555] leading-snug" style={{
          fontFamily: fontStyle.font,
          fontStyle: fontStyle.style,
          fontSize: "clamp(11px, 1.3vw, 14px)",
        }}>
          {card.caption}
        </p>
        <p className="mt-2 text-[#aaa] truncate" style={{
          fontSize: "clamp(8px, 0.9vw, 10px)",
          fontFamily: "var(--font-josefin), sans-serif",
          letterSpacing: "0.05em",
        }}>
          — {card.name}
        </p>
      </div>
    )
  }

  if (card.type === "meme") {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 p-3 text-center" style={{ backgroundColor: card.bg }}>
        <p className="font-bold tracking-widest uppercase text-white opacity-70" style={{
          fontFamily: "var(--font-josefin), sans-serif",
          fontSize: "clamp(9px, 1.1vw, 13px)",
        }}>{card.top}</p>
        <div style={{ fontSize: "clamp(30px, 5vw, 50px)" }}>{card.emoji}</div>
        <p className="font-bold tracking-wide uppercase text-white" style={{
          fontFamily: "var(--font-nunito), sans-serif",
          fontSize: "clamp(10px, 1.3vw, 15px)",
        }}>{card.bottom}</p>
      </div>
    )
  }

  return null
}

export function MemoryGrid() {
  const GRID_SIZE = 24
  const [visible, setVisible] = useState<MemoryCard[]>([])
  const [fading, setFading] = useState<Set<number>>(new Set())

  useEffect(() => {
    setVisible(shuffle(MEMORIES).slice(0, GRID_SIZE))
  }, [])

  useEffect(() => {
    if (visible.length === 0) return
    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 2) + 1
      const positions = new Set<number>()
      while (positions.size < count) {
        positions.add(Math.floor(Math.random() * GRID_SIZE))
      }
      setFading(positions)
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev]
          const pool = shuffle(MEMORIES.filter((m) => !prev.includes(m)))
          let ri = 0
          positions.forEach((pos) => {
            next[pos] = pool[ri++ % pool.length] ?? MEMORIES[Math.floor(Math.random() * MEMORIES.length)]
          })
          return next
        })
        setFading(new Set())
      }, 500)
    }, 1800)
    return () => clearInterval(interval)
  }, [visible.length])

  if (visible.length === 0) return (
    <div className="grid grid-cols-6 gap-1 w-full">
      {Array.from({ length: GRID_SIZE }).map((_, i) => (
        <div key={i} className="aspect-square bg-[#f0ebe0]" />
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-6 gap-1 w-full">
      {visible.map((card, i) => (
        <div
          key={i}
          className="aspect-square overflow-hidden transition-opacity duration-500"
          style={{ opacity: fading.has(i) ? 0 : 1 }}
        >
          <CardContent card={card} index={i} />
        </div>
      ))}
    </div>
  )
}
