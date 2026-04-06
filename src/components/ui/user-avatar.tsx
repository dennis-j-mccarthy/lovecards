import { cn } from "@/lib/utils"

type AvatarSize = "sm" | "md" | "lg" | "xl"

interface UserAvatarProps {
  name?: string | null
  email?: string | null
  image?: string | null
  size?: AvatarSize
  className?: string
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-12 h-12", text: "text-base" },
  xl: { container: "w-20 h-20", text: "text-2xl" },
}

// Stable color from a string
const avatarColors = [
  "bg-[#800020]",
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-cyan-500",
]

function getColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }
  return "?"
}

export function UserAvatar({ name, email, image, size = "md", className }: UserAvatarProps) {
  const { container, text } = sizeStyles[size]
  const initials = getInitials(name, email)
  const colorClass = getColor(email || name || "default")

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name || "Avatar"}
        className={cn(container, "rounded-full object-cover flex-shrink-0", className)}
      />
    )
  }

  return (
    <div
      className={cn(
        container,
        colorClass,
        "rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 select-none",
        text,
        className,
      )}
      aria-label={name || email || "User avatar"}
    >
      {initials}
    </div>
  )
}
