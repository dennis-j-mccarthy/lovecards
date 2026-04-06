import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"
import { getDbUser } from "@/lib/user"

export const runtime = "nodejs"

async function cleanupDemoTributes(userId: string) {
  const tributes = await prisma.tribute.findMany({
    where: { userId },
    select: { id: true, paymentId: true },
  })

  for (const tribute of tributes) {
    await prisma.contribution.deleteMany({ where: { tributeId: tribute.id } })
    await prisma.inviteToken.deleteMany({ where: { tributeId: tribute.id } })
    await prisma.inviteEmail.deleteMany({ where: { tributeId: tribute.id } })
    await prisma.tribute.delete({ where: { id: tribute.id } })
    if (tribute.paymentId) {
      await prisma.payment.delete({ where: { id: tribute.paymentId } }).catch(() => {})
    }
  }
}

async function createDemoTributeWithData(userId: string, includeContributions: boolean) {
  const checkoutSessionId = `demo_cs_${Date.now()}`

  const payment = await prisma.payment.create({
    data: {
      userId,
      stripePaymentIntentId: `demo_pi_${Date.now()}`,
      stripeCheckoutSessionId: checkoutSessionId,
      amount: 4900,
      status: "COMPLETED",
    },
  })

  const slug = generateSlug("Sarah Mitchell")

  const tribute = await prisma.tribute.create({
    data: {
      userId,
      paymentId: payment.id,
      slug,
      honoredName: "Sarah Mitchell",
      relationship: "My best friend",
      tributeMessage:
        "Sarah turns 40 this year and I want to surprise her with something she'll never forget — a box full of love from everyone in her life. If you know Sarah, you know she deserves this.",
      birthDate: new Date("1986-06-22"),
      location: "Austin, Texas",
      status: "ACTIVE",
    },
  })

  const inviteToken = await prisma.inviteToken.create({
    data: { tributeId: tribute.id },
  })

  if (includeContributions) {
    await prisma.contribution.createMany({
      data: [
        {
          tributeId: tribute.id,
          type: "TEXT_AND_PHOTO",
          contributorName: "Jake Torres",
          avatarUrl: "https://i.pravatar.cc/100?u=jake",
          message:
            "Sarah, you talked me into running that half marathon in 2019 and I've never forgiven you. Just kidding — it changed my life. You have a way of pushing people to be better without them even realizing it. Happy 40th!",
          photoUrl: "https://images.unsplash.com/photo-1714963145999-f35277765fe6?w=600&h=400&fit=crop",
          isAnonymous: false,
          status: "APPROVED",
        },
        {
          tributeId: tribute.id,
          type: "TEXT_AND_PHOTO",
          contributorName: "Priya Nair",
          avatarUrl: "https://i.pravatar.cc/100?u=priya",
          message:
            "Remember when we got lost in Rome and you somehow ordered us dinner in Italian you made up on the spot? The waiter was so confused but the food was amazing. You make everything an adventure.",
          photoUrl: "https://images.unsplash.com/photo-1515542483964-5e8c63d7d89b?w=600&h=400&fit=crop",
          isAnonymous: false,
          status: "APPROVED",
        },
        {
          tributeId: tribute.id,
          type: "TEXT",
          contributorName: null,
          message:
            "You probably don't know this, but you changed my life at that conference in Denver. What you said about taking the leap stuck with me. I quit my job the next month and started my own company. Thank you.",
          isAnonymous: true,
          status: "APPROVED",
        },
        {
          tributeId: tribute.id,
          type: "TEXT_AND_PHOTO",
          contributorName: "Mom",
          avatarUrl: "https://i.pravatar.cc/100?u=mom",
          message:
            "My sweet girl. From the moment you were born, you filled every room with light. Watching you grow into this incredible woman has been the greatest joy of my life. Forty looks wonderful on you.",
          photoUrl: "https://images.unsplash.com/photo-1752652011925-a397442fbe0b?w=600&h=400&fit=crop",
          isAnonymous: false,
          status: "APPROVED",
        },
        {
          tributeId: tribute.id,
          type: "TEXT",
          contributorName: "David Park",
          avatarUrl: "https://i.pravatar.cc/100?u=david",
          message:
            "You're the only person I know who sends handwritten thank-you notes in 2026. That's the kind of person you are — thoughtful in a way most people have forgotten how to be. The world needs more Sarahs.",
          isAnonymous: false,
          status: "APPROVED",
        },
        {
          tributeId: tribute.id,
          type: "TEXT_AND_PHOTO",
          contributorName: "Lena Kowalski",
          avatarUrl: "https://i.pravatar.cc/100?u=lena",
          message:
            "Ten years of friendship and you still answer the phone at midnight when I need to talk. You don't just show up for people — you stay. Happy birthday to the most loyal human I know.",
          photoUrl: "https://images.unsplash.com/photo-1546405386-e8097f926ace?w=600&h=400&fit=crop",
          isAnonymous: false,
          status: "APPROVED",
        },
        {
          tributeId: tribute.id,
          type: "TEXT_AND_PHOTO",
          contributorName: "Carlos Reyes",
          avatarUrl: "https://i.pravatar.cc/100?u=carlos",
          message:
            "Remember when you drove three hours in a snowstorm to be at my wedding? That's Sarah. She doesn't cancel, she doesn't flake, she shows up. Every single time. Happy birthday, legend.",
          photoUrl: "https://images.unsplash.com/photo-1749235878214-8a3079c72e5a?w=600&h=400&fit=crop",
          isAnonymous: false,
          status: "APPROVED",
        },
        {
          tributeId: tribute.id,
          type: "TEXT",
          contributorName: "Nina Patel",
          avatarUrl: "https://i.pravatar.cc/100?u=nina",
          message:
            "You taught me that it's okay to ask for help. That one conversation in your kitchen changed everything for me. I hope you know how many lives you've quietly changed just by being you.",
          isAnonymous: false,
          status: "APPROVED",
        },
        {
          tributeId: tribute.id,
          type: "TEXT_AND_PHOTO",
          contributorName: "Uncle Rob",
          avatarUrl: "https://i.pravatar.cc/100?u=rob",
          message:
            "From the little girl who used to steal my sunglasses to this incredible woman — what a ride. Your dad would be so proud. Hell, we're all proud. Cheers to forty more.",
          photoUrl: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=600&h=400&fit=crop",
          isAnonymous: false,
          status: "APPROVED",
        },
        {
          tributeId: tribute.id,
          type: "TEXT",
          contributorName: "Mei Lin Chen",
          avatarUrl: "https://i.pravatar.cc/100?u=mei",
          message:
            "Four years of sitting next to each other in that open office and you never once complained about my keyboard. That's real friendship. Happy 40th to the most patient human alive.",
          isAnonymous: false,
          status: "APPROVED",
        },
      ],
    })
  }

  return { tribute, inviteToken, checkoutSessionId }
}

async function createPopulatedTributeWithData(userId: string) {
  const checkoutSessionId = `demo_cs_${Date.now()}`

  const payment = await prisma.payment.create({
    data: {
      userId,
      stripePaymentIntentId: `demo_pi_${Date.now()}`,
      stripeCheckoutSessionId: checkoutSessionId,
      amount: 4900,
      status: "COMPLETED",
    },
  })

  const slug = generateSlug("Sarah Mitchell")

  const tribute = await prisma.tribute.create({
    data: {
      userId,
      paymentId: payment.id,
      slug,
      honoredName: "Sarah Mitchell",
      relationship: "My best friend",
      tributeMessage:
        "Sarah turns 40 this year and I want to surprise her with something she'll never forget — a box full of love from everyone in her life. If you know Sarah, you know she deserves this.",
      birthDate: new Date("1986-06-22"),
      location: "Austin, Texas",
      status: "ACTIVE",
    },
  })

  const inviteToken = await prisma.inviteToken.create({
    data: { tributeId: tribute.id },
  })

  await prisma.contribution.createMany({
    data: [
      {
        tributeId: tribute.id,
        type: "TEXT_AND_PHOTO",
        contributorName: "Jake Torres",
        avatarUrl: "https://i.pravatar.cc/100?u=jake",
        message: "Sarah, you talked me into running that half marathon in 2019 and I've never forgiven you. Just kidding — it changed my life.",
        photoUrl: "https://images.unsplash.com/photo-1714963145999-f35277765fe6?w=600&h=400&fit=crop",
        isAnonymous: false,
        status: "APPROVED",
      },
      {
        tributeId: tribute.id,
        type: "TEXT_AND_PHOTO",
        contributorName: "Priya Nair",
        avatarUrl: "https://i.pravatar.cc/100?u=priya",
        message: "Remember when we got lost in Rome and you somehow ordered us dinner in Italian you made up on the spot?",
        photoUrl: "https://images.unsplash.com/photo-1515542483964-5e8c63d7d89b?w=600&h=400&fit=crop",
        isAnonymous: false,
        status: "APPROVED",
      },
      {
        tributeId: tribute.id,
        type: "TEXT_AND_PHOTO",
        contributorName: "Mom",
        avatarUrl: "https://i.pravatar.cc/100?u=mom",
        message: "My sweet girl. Watching you grow into this incredible woman has been the greatest joy of my life. Forty looks wonderful on you.",
        photoUrl: "https://images.unsplash.com/photo-1752652011925-a397442fbe0b?w=600&h=400&fit=crop",
        isAnonymous: false,
        status: "APPROVED",
      },
      {
        tributeId: tribute.id,
        type: "TEXT_AND_PHOTO",
        contributorName: "Carlos Reyes",
        avatarUrl: "https://i.pravatar.cc/100?u=carlos",
        message: "Remember when you drove three hours in a snowstorm to be at my wedding? That's Sarah. She shows up. Every single time.",
        photoUrl: "https://images.unsplash.com/photo-1749235878214-8a3079c72e5a?w=600&h=400&fit=crop",
        isAnonymous: false,
        status: "APPROVED",
      },
      {
        tributeId: tribute.id,
        type: "TEXT",
        contributorName: null,
        message: "You changed my life at that conference in Denver. I quit my job the next month and started my own company. Thank you.",
        isAnonymous: true,
        status: "APPROVED",
      },
    ],
  })

  const contributedEmails = [
    { email: "jake@example.com", name: "Jake Torres" },
    { email: "priya@example.com", name: "Priya Nair" },
    { email: "mom@example.com", name: "Mom" },
    { email: "carlos@example.com", name: "Carlos Reyes" },
  ]
  for (const { email, name } of contributedEmails) {
    await prisma.inviteToken.create({
      data: { tributeId: tribute.id, email, usedCount: 1, maxUses: 1 },
    })
    await prisma.inviteEmail.create({
      data: {
        tributeId: tribute.id,
        toEmail: email,
        toName: name,
        sentAt: new Date(Date.now() - 7 * 86400000),
      },
    })
  }

  const pendingEmails = [
    { email: "lena.k@example.com", name: "Lena Kowalski", cellPhone: "(555) 234-5678", phone: "(555) 234-0001" },
    { email: "nina.p@example.com", name: "Nina Patel", cellPhone: "(555) 345-6789", phone: "" },
    { email: "david.park@example.com", name: "David Park", cellPhone: "(555) 456-7890", phone: "(555) 456-0002" },
  ]
  for (const { email, name, cellPhone, phone } of pendingEmails) {
    await prisma.inviteToken.create({
      data: { tributeId: tribute.id, email, cellPhone, phone: phone || null, usedCount: 0, maxUses: 1 },
    })
    await prisma.inviteEmail.create({
      data: {
        tributeId: tribute.id,
        toEmail: email,
        toName: name,
        toCellPhone: cellPhone,
        toPhone: phone || null,
        sentAt: new Date(Date.now() - 5 * 86400000),
      },
    })
  }

  return { tribute, inviteToken, checkoutSessionId }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getDbUser()
    if (!user) {
      return NextResponse.json({ error: "Sign in first" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const scenario = body.scenario || "buyer-with-tribute"

    await cleanupDemoTributes(user.id)

    let redirectUrl = "/dashboard"
    let contributeUrl: string | null = null

    if (scenario === "purchase-sim") {
      return NextResponse.json({ redirectUrl: "/checkout", contributeUrl })
    }

    if (scenario === "buyer-fresh") {
      const checkoutSessionId = `demo_cs_${Date.now()}`
      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentIntentId: `demo_pi_${Date.now()}`,
          stripeCheckoutSessionId: checkoutSessionId,
          amount: 4900,
          status: "COMPLETED",
        },
      })
      redirectUrl = `/checkout/success?session_id=${checkoutSessionId}`
      return NextResponse.json({ redirectUrl, contributeUrl })
    }

    if (scenario === "contributor") {
      const { tribute, inviteToken } = await createDemoTributeWithData(user.id, true)
      contributeUrl = `/tribute/${tribute.slug}/contribute?token=${inviteToken.token}`
      return NextResponse.json({ redirectUrl: contributeUrl, contributeUrl })
    }

    if (scenario === "populated-dashboard") {
      const { tribute, inviteToken } = await createPopulatedTributeWithData(user.id)
      contributeUrl = `/tribute/${tribute.slug}/contribute?token=${inviteToken.token}`
      redirectUrl = `/dashboard/${tribute.id}`
      return NextResponse.json({ redirectUrl, contributeUrl })
    }

    // "buyer-with-tribute" or "post-purchase"
    const includeContributions = scenario === "post-purchase"
    const { tribute, inviteToken } = await createDemoTributeWithData(user.id, includeContributions)
    contributeUrl = `/tribute/${tribute.slug}/contribute?token=${inviteToken.token}`
    redirectUrl = `/dashboard/${tribute.id}`
    return NextResponse.json({ redirectUrl, contributeUrl })
  } catch (err) {
    console.error("Demo route error:", err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE() {
  const user = await getDbUser()
  if (user) {
    await cleanupDemoTributes(user.id)
  }
  return NextResponse.json({ cleared: true })
}
