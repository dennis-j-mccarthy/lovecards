import {
  Contribution,
  DesignTemplate,
  InviteToken,
  Payment,
  Tribute,
  User,
} from "@prisma/client"

export type TributeWithRelations = Tribute & {
  user: User
  payment: Payment
  template: DesignTemplate | null
  contributions: Contribution[]
  inviteTokens: InviteToken[]
}

export type TributeWithContributions = Tribute & {
  contributions: Contribution[]
  template: DesignTemplate | null
}

// Contribution shape safe to send to contributors (hides private info)
export type PublicContribution = {
  id: string
  type: Contribution["type"]
  isAnonymous: boolean
  contributorName: string | null
  avatarUrl: string | null
  message: string | null
  photoUrl: string | null
  createdAt: Date
}

export function toPublicContribution(c: Contribution): PublicContribution {
  return {
    id: c.id,
    type: c.type,
    isAnonymous: c.isAnonymous,
    contributorName: c.isAnonymous ? null : c.contributorName,
    avatarUrl: c.isAnonymous ? null : c.avatarUrl,
    message: c.isHidden ? null : c.message,
    photoUrl: c.isHidden ? null : c.photoUrl,
    createdAt: c.createdAt,
  }
}
