"use client"

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"

const FAN_CARDS = [
  {
    text: "You believed in me before I could find it in myself.",
    name: "Noah G.",
    avatarUrl: "https://i.pravatar.cc/80?u=noah",
    photoUrl: "https://images.unsplash.com/photo-1757367529666-2521d7002ae4?w=260&h=120&fit=crop",
    bg: "#ffffff", color: "#1f2937", font: "var(--font-playfair), serif",
    border: "2px solid #818cf8", accent: "#818cf8",
  },
  {
    text: "Your laugh has a way of making any room feel like home.",
    name: "Elena W.",
    avatarUrl: "https://i.pravatar.cc/80?u=elena",
    photoUrl: null,
    bg: "#fdf8f2", color: "#3a3020", font: "var(--font-lora), serif",
    border: "1px solid #b8a88a", accent: "#b8a88a",
  },
  {
    text: "You hold this family together in ways most of us will never fully see.",
    name: "Finn B.",
    avatarUrl: "https://i.pravatar.cc/80?u=finn",
    photoUrl: "https://images.unsplash.com/photo-1578496780896-7081cc23c111?w=260&h=120&fit=crop",
    bg: "#f9f6f0", color: "#1f2937", font: "var(--font-garamond), serif",
    border: "1px solid #1f2937", accent: "#1f2937",
  },
  {
    text: "Tell me, what is it you plan to do with your one wild and precious life?",
    name: "Mary Oliver · Shared by Priya N.",
    avatarUrl: "https://i.pravatar.cc/80?u=priya2",
    photoUrl: null,
    bg: "#f7f9f7", color: "#2a3828", font: "var(--font-crimson), serif",
    border: "2px solid #6b8f6b", accent: "#6b8f6b",
  },
  {
    text: "You are the reason I believe I can do anything.",
    name: "Ben C.",
    avatarUrl: "https://i.pravatar.cc/80?u=ben",
    photoUrl: "https://images.unsplash.com/photo-1723871892806-155bda056c3b?w=260&h=120&fit=crop",
    bg: "#fffdf9", color: "#111827", font: "var(--font-dancing), cursive",
    border: "1px solid #818cf8", accent: "#818cf8",
  },
]

export function CardFan() {
  const [activeCard, setActiveCard] = useState(0)
  const [fanning, setFanning] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setFanning(true)
      setTimeout(() => {
        setActiveCard(i => (i + 1) % FAN_CARDS.length)
        setFanning(false)
      }, 400)
    }, 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: '100%', height: 560 }}>
      {/* Soft glow behind fan */}
      <div
        className="absolute rounded-full blur-3xl opacity-30"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, #f0d5b8, transparent 70%)',
        }}
      />

      {/* Fan of cards */}
      <div className="relative" style={{ width: 320, height: 460 }}>
        {FAN_CARDS.map((card, i) => {
          const isActive = i === activeCard
          const offset = i - activeCard
          const adjustedOffset = offset > 2 ? offset - FAN_CARDS.length : offset < -2 ? offset + FAN_CARDS.length : offset
          const rotation = adjustedOffset * 8
          const translateX = adjustedOffset * 22
          const translateY = isActive ? -12 : Math.abs(adjustedOffset) * 10
          const zIndex = FAN_CARDS.length - Math.abs(adjustedOffset)
          const scale = isActive ? 1 : 1 - Math.abs(adjustedOffset) * 0.04

          return (
            <div
              key={i}
              className="absolute"
              style={{
                width: 260,
                height: 340,
                left: '50%',
                top: '50%',
                backgroundColor: card.bg,
                border: card.border,
                borderRadius: 6,
                boxShadow: isActive
                  ? '0 24px 60px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1)'
                  : '0 10px 24px rgba(0,0,0,0.12)',
                transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg) scale(${scale})`,
                zIndex,
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                opacity: fanning && isActive ? 0.6 : 1,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Inner decorative border */}
              <div
                className="absolute inset-[8px] pointer-events-none"
                style={{ border: `1px solid ${card.accent}`, opacity: 0.25, borderRadius: 4, zIndex: 2 }}
              />

              {/* Photo area (top of card) */}
              {card.photoUrl && (
                <div style={{ width: '100%', height: 110, flexShrink: 0, overflow: 'hidden' }}>
                  <img
                    src={card.photoUrl}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Text content */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: card.photoUrl ? '14px 24px 16px' : '28px 24px',
              }}>
                <p style={{
                  fontFamily: card.font,
                  fontSize: card.photoUrl ? 14 : 17,
                  lineHeight: 1.6,
                  color: card.color,
                  fontStyle: 'italic',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: card.photoUrl ? 3 : 5,
                  WebkitBoxOrient: 'vertical',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  &ldquo;{card.text}&rdquo;
                </p>

                {/* Avatar + name */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 12,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <img
                    src={card.avatarUrl}
                    alt={card.name}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `1px solid ${card.accent}40`,
                    }}
                  />
                  <p style={{
                    fontFamily: 'var(--font-josefin), sans-serif',
                    fontSize: 11,
                    color: card.color,
                    opacity: 0.5,
                    letterSpacing: '0.06em',
                  }}>
                    — {card.name}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
