"use client"

import { useEffect, useState } from "react"

// border: outer CSS border | accent: inner decorative border color | borderStyle: which inset treatment
const SAMPLE_CARDS = [
  {
    text: "You believed in me before I could find it in myself.",
    name: "Noah G.",
    bg: "#faf9f7", color: "#2d2d2d", font: "var(--font-playfair), serif",
    border: "2px solid #c9a96e",        // gold outer rule
    accent: "#c9a96e", borderStyle: "double-inset",
  },
  {
    text: "Your laugh has a way of making any room feel like home.",
    name: "Elena W.",
    bg: "#fdf8f2", color: "#3a3020", font: "var(--font-lora), serif",
    border: "1px solid #b8a88a",        // warm thin rule
    accent: "#b8a88a", borderStyle: "corner-marks",
  },
  {
    text: "You hold this family together in ways most of us will never fully see. I see it.",
    name: "Finn B.",
    bg: "#f9f6f0", color: "#2d2d2d", font: "var(--font-garamond), serif",
    border: "1px solid #2d2d2d",        // crisp dark rule
    accent: "#2d2d2d", borderStyle: "double-rule",
  },
  {
    text: "Tell me, what is it you plan to do with your one wild and precious life?",
    name: "Mary Oliver · Shared by Priya N.",
    bg: "#f7f9f7", color: "#2a3828", font: "var(--font-crimson), serif",
    border: "2px solid #6b8f6b",        // sage green rule
    accent: "#6b8f6b", borderStyle: "double-inset",
  },
  {
    text: "You are the reason I believe I can do anything.",
    name: "Ben C.",
    bg: "#fffdf9", color: "#1a1a1a", font: "var(--font-dancing), cursive",
    border: "1px solid #c9a96e",
    accent: "#c9a96e", borderStyle: "corner-marks",
  },
  {
    text: "Every birthday cake from scratch — that's love in flour and butter.",
    name: "Nora H.",
    bg: "#faf9f7", color: "#2d2d2d", font: "var(--font-merriweather), serif",
    border: "1px solid #aaa",           // neutral silver rule
    accent: "#aaa", borderStyle: "double-rule",
  },
]

// Decorative inset border treatments
function CardInner({ card, small = false }: { card: typeof SAMPLE_CARDS[0], small?: boolean }) {
  const fs = small ? 7.5 : 8.5
  const nameFs = small ? 5.5 : 6.5

  // Corner marks: small L-shaped ticks in each corner
  const CornerMarks = () => (
    <>
      {[
        { top: 5, left: 5, borderTop: `1px solid ${card.accent}`, borderLeft: `1px solid ${card.accent}` },
        { top: 5, right: 5, borderTop: `1px solid ${card.accent}`, borderRight: `1px solid ${card.accent}` },
        { bottom: 5, left: 5, borderBottom: `1px solid ${card.accent}`, borderLeft: `1px solid ${card.accent}` },
        { bottom: 5, right: 5, borderBottom: `1px solid ${card.accent}`, borderRight: `1px solid ${card.accent}` },
      ].map((s, i) => (
        <div key={i} className="absolute" style={{ width: 8, height: 8, ...s }} />
      ))}
    </>
  )

  // Double inset: a second full border 4px inside
  const DoubleInset = () => (
    <div className="absolute inset-[4px] pointer-events-none" style={{
      border: `1px solid ${card.accent}`,
      opacity: 0.4,
      borderRadius: 1,
    }} />
  )

  // Double rule: thin top + bottom horizontal lines inside
  const DoubleRule = () => (
    <>
      <div className="absolute left-[8px] right-[8px]" style={{ top: 6, height: 1, background: card.accent, opacity: 0.35 }} />
      <div className="absolute left-[8px] right-[8px]" style={{ bottom: 6, height: 1, background: card.accent, opacity: 0.35 }} />
    </>
  )

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {card.borderStyle === "corner-marks" && <CornerMarks />}
      {card.borderStyle === "double-inset" && <DoubleInset />}
      {card.borderStyle === "double-rule" && <DoubleRule />}
      <p style={{
        fontFamily: card.font,
        fontSize: fs,
        lineHeight: 1.5,
        color: card.color,
        fontStyle: "italic",
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 4,
        WebkitBoxOrient: "vertical",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>
        &ldquo;{card.text}&rdquo;
      </p>
      <p style={{
        fontFamily: "var(--font-josefin), sans-serif",
        fontSize: nameFs,
        color: card.color,
        opacity: 0.55,
        marginTop: 5,
        letterSpacing: "0.06em",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>— {card.name}</p>
    </div>
  )
}

export function ProductMockup() {
  const [activeCard, setActiveCard] = useState(0)
  const [fanning, setFanning] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setFanning(true)
      setTimeout(() => {
        setActiveCard(i => (i + 1) % SAMPLE_CARDS.length)
        setFanning(false)
      }, 400)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    // Outer container — normal flow, no overflow clipping upward
    <div className="relative w-full flex flex-col items-center select-none" style={{ paddingTop: 16, paddingBottom: 32 }}>

      {/* ── SCENE: cards + box stacked vertically in flow ── */}
      <div className="relative flex flex-col items-center" style={{ width: 320 }}>

        {/* Fan of cards — sits in flow ABOVE the box */}
        <div className="relative flex items-end justify-center" style={{ width: 300, height: 140, marginBottom: -12, zIndex: 20 }}>
          {SAMPLE_CARDS.map((card, i) => {
            const isActive = i === activeCard
            const offset = i - activeCard
            const rotation = offset * 7
            const translateX = offset * 10
            const translateY = isActive ? -12 : Math.abs(offset) * 2
            const zIndex = SAMPLE_CARDS.length - Math.abs(offset)
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  width: 140,
                  height: 110,
                  bottom: 0,
                  left: "50%",
                  backgroundColor: card.bg,
                  border: card.border,
                  borderRadius: 2,
                  boxShadow: isActive
                    ? "0 12px 30px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.15)"
                    : "0 4px 12px rgba(0,0,0,0.2)",
                  transform: `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) rotate(${rotation}deg)`,
                  zIndex,
                  transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  opacity: fanning && isActive ? 0.7 : 1,
                  padding: 10,
                  textAlign: "center",
                  overflow: "hidden",
                }}
              >
                <CardInner card={card} />
              </div>
            )
          })}
        </div>

        {/* Box — sits below cards in flow */}
        <div className="relative" style={{ perspective: "900px", zIndex: 10 }}>

          {/* Floor shadow */}
          <div className="absolute" style={{
            bottom: -18, left: "50%", transform: "translateX(-50%)",
            width: 320, height: 30,
            background: "radial-gradient(ellipse, rgba(0,0,0,0.22) 0%, transparent 70%)",
            filter: "blur(8px)",
          }} />

          {/* Box body */}
          <div className="relative" style={{
            width: 300,
            transformStyle: "preserve-3d",
            transform: "rotateX(4deg) rotateY(-8deg)",
          }}>

            {/* Lid — slightly open, sits on top of box front */}
            <div className="absolute" style={{
              top: -52,
              left: -2,
              width: 304,
              height: 40,
              background: "linear-gradient(180deg, #4a3c28 0%, #3d3020 80%, #2a2015 100%)",
              borderRadius: "4px 4px 0 0",
              transform: "rotateX(-55deg)",
              transformOrigin: "bottom center",
              boxShadow: "0 -8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              zIndex: 5,
            }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <p style={{
                  fontSize: 7,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(201,169,110,0.4)",
                  fontFamily: "var(--font-josefin), sans-serif",
                }}>You Are So Loved</p>
              </div>
            </div>

            {/* Box top face */}
            <div className="absolute" style={{
              top: -38,
              left: 0,
              width: 300,
              height: 40,
              background: "linear-gradient(180deg, #3d3020 0%, #2a2015 100%)",
              transform: "rotateX(90deg)",
              transformOrigin: "bottom center",
              borderRadius: "4px 4px 0 0",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            }} />

            {/* Box front face */}
            <div className="relative overflow-hidden" style={{
              width: 300,
              height: 200,
              background: "linear-gradient(160deg, #2a2015 0%, #1a1408 60%, #0f0c05 100%)",
              borderRadius: "2px 2px 4px 4px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
              {/* Texture grain */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
              }} />
              {/* Foil stamp */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, #c9a96e, transparent)" }} />
                <p style={{
                  fontSize: 10,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "#c9a96e",
                  fontFamily: "var(--font-josefin), sans-serif",
                  opacity: 0.9,
                }}>You Are So Loved</p>
                <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #c9a96e, transparent)" }} />
                <p style={{
                  fontSize: 7,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#c9a96e",
                  fontFamily: "var(--font-josefin), sans-serif",
                  opacity: 0.5,
                  marginTop: 4,
                }}>A Keepsake Collection</p>
              </div>
              {/* Bottom edge highlight */}
              <div className="absolute bottom-0 left-0 right-0" style={{
                height: 2,
                background: "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.4) 50%, transparent 100%)",
              }} />
            </div>

            {/* Box right face */}
            <div className="absolute" style={{
              top: 0,
              right: -28,
              width: 30,
              height: 200,
              background: "linear-gradient(90deg, #0f0c05 0%, #1a1408 100%)",
              transform: "rotateY(90deg)",
              transformOrigin: "left center",
              opacity: 0.9,
            }} />

          </div>
        </div>

        {/* Scattered cards below/beside the box */}
        <div className="relative w-full" style={{ height: 140, marginTop: 8 }}>
          {[
            { card: SAMPLE_CARDS[1], x: -60, rot: -11, scale: 0.88 },
            { card: SAMPLE_CARDS[3], x: 160, rot: 8, scale: 0.84 },
            { card: SAMPLE_CARDS[5], x: -20, rot: 4, scale: 0.78 },
          ].map(({ card, x, rot, scale }, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: 130,
                height: 100,
                top: i * 14,
                left: `calc(50% + ${x}px)`,
                backgroundColor: card.bg,
                border: card.border,
                borderRadius: 2,
                boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                transform: `rotate(${rot}deg) scale(${scale})`,
                padding: 10,
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              <CardInner card={card} small />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
