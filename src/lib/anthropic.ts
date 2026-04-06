import Anthropic from "@anthropic-ai/sdk"
import { Contribution, DesignTemplate, Tribute } from "@prisma/client"

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
}

export interface CardCell {
  type: "contribution" | "honored_photo" | "title_cell" | "decorative"
  contributionId?: string
  content?: string
  photoUrl?: string
  contributorName?: string
  isAnonymous?: boolean
  style: {
    textSize: "sm" | "md" | "lg"
    emphasis: "normal" | "featured"
    alignment: "left" | "center" | "right"
  }
  spanCols?: number // 1 (default) or 3 (featured full row)
}

export interface CardPage {
  pageNumber: number
  layout: "3x3" | "featured_top" | "featured_middle" | "featured_bottom"
  cells: CardCell[]
}

export interface CardLayoutResponse {
  totalPages: number
  honoredName: string
  pages: CardPage[]
  designNotes: string
}

type TributeWithContributions = Tribute & {
  contributions: Contribution[]
  template: DesignTemplate | null
}

export async function generateCardLayout(
  tribute: TributeWithContributions
): Promise<CardLayoutResponse> {
  const contributions = tribute.contributions
    .filter((c) => c.status === "APPROVED" && !c.isHidden)
    .map((c) => ({
      id: c.id,
      type: c.type,
      hasMessage: !!c.message,
      hasPhoto: !!c.photoUrl,
      isAnonymous: c.isAnonymous,
      contributorName: c.isAnonymous ? null : c.contributorName,
      messageLength: c.message?.length ?? 0,
      messagePreview: c.message ? c.message.slice(0, 120) : null,
    }))

  const template = tribute.template

  const systemPrompt = `You are a memorial card layout designer. You arrange tribute contributions into beautiful 3x3 grid layouts for 8.5x11 inch printed cards. Each page has exactly 9 cell slots.

LAYOUT RULES:
- Normal cell = 1 slot in the 3x3 grid
- Featured cell = spans full row (3 slots), replacing 3 normal cells. Use for long messages (250+ chars)
- Each page must use exactly 9 slots total (featured=3 slots, normal=1 slot)
- Page 1, first cell: ALWAYS a title_cell featuring the honored person (if no photo) or honored_photo (if photo provided)
- Distribute anonymous contributions naturally, not clustered together
- If fewer contributions than cells, fill remaining with decorative cells
- Photo contributions and text contributions can coexist in adjacent cells

TEXT SIZE RULES:
- messageLength < 100: textSize "lg" (big, impactful display)
- messageLength 100-250: textSize "md"
- messageLength > 250: textSize "sm" (featured cell recommended)

LAYOUT TYPE NAMES:
- "3x3" = all 9 cells are normal (1 slot each)
- "featured_top" = first row is one featured cell (3 slots) + 6 normal cells
- "featured_middle" = 3 normal + 1 featured (3 slots) + 3 normal
- "featured_bottom" = 6 normal + 1 featured (3 slots)

Return ONLY valid JSON. No explanation. No markdown. Raw JSON only.`

  const userPrompt = `Design a memorial card layout for ${tribute.honoredName}.

Template theme: ${template?.theme ?? "classic"}
Honored person has photo: ${tribute.honoredPhoto ? "YES" : "NO"}
Total contributions: ${contributions.length}

Contributions:
${JSON.stringify(contributions, null, 2)}

Return a CardLayoutResponse JSON object with this exact shape:
{
  "totalPages": number,
  "honoredName": "${tribute.honoredName}",
  "pages": [
    {
      "pageNumber": 1,
      "layout": "3x3" | "featured_top" | "featured_middle" | "featured_bottom",
      "cells": [
        {
          "type": "contribution" | "honored_photo" | "title_cell" | "decorative",
          "contributionId": "string or omit",
          "content": "display text (truncated if needed) or omit",
          "photoUrl": "omit - will be filled in at render time",
          "contributorName": "name or omit",
          "isAnonymous": true/false or omit,
          "style": {
            "textSize": "sm" | "md" | "lg",
            "emphasis": "normal" | "featured",
            "alignment": "left" | "center" | "right"
          },
          "spanCols": 1 or 3
        }
      ]
    }
  ],
  "designNotes": "brief explanation of layout decisions"
}`

  const response = await getClient().messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  })

  const content = response.content[0]
  if (content.type !== "text") throw new Error("Unexpected response type from Claude")

  let jsonText = content.text.trim()
  // Strip markdown code fences if present
  const fenceMatch = jsonText.match(/```(?:json)?\n?([\s\S]+?)\n?```/)
  if (fenceMatch) jsonText = fenceMatch[1]

  const layout: CardLayoutResponse = JSON.parse(jsonText)
  return layout
}

// Fallback layout if Claude fails — simple sequential arrangement
export function generateFallbackLayout(
  tribute: TributeWithContributions
): CardLayoutResponse {
  const contributions = tribute.contributions
    .filter((c) => c.status === "APPROVED" && !c.isHidden)
    .sort(() => Math.random() - 0.5) // Randomize card order

  const pages: CardPage[] = []
  const CELLS_PER_PAGE = 9

  // Reserve first slot of page 1 for title/photo
  const totalSlots = Math.max(
    CELLS_PER_PAGE,
    Math.ceil((contributions.length + 1) / CELLS_PER_PAGE) * CELLS_PER_PAGE
  )
  const totalPages = totalSlots / CELLS_PER_PAGE

  for (let p = 0; p < totalPages; p++) {
    const cells: CardCell[] = []

    for (let c = 0; c < CELLS_PER_PAGE; c++) {
      const globalSlot = p * CELLS_PER_PAGE + c

      if (globalSlot === 0) {
        cells.push({
          type: tribute.honoredPhoto ? "honored_photo" : "title_cell",
          style: { textSize: "lg", emphasis: "normal", alignment: "center" },
        })
        continue
      }

      const contributionIdx = globalSlot - 1
      if (contributionIdx < contributions.length) {
        const contrib = contributions[contributionIdx]
        const msgLen = contrib.message?.length ?? 0
        cells.push({
          type: "contribution",
          contributionId: contrib.id,
          content: contrib.message ?? undefined,
          contributorName: contrib.isAnonymous ? undefined : contrib.contributorName ?? undefined,
          isAnonymous: contrib.isAnonymous,
          style: {
            textSize: msgLen < 100 ? "lg" : msgLen < 250 ? "md" : "sm",
            emphasis: "normal",
            alignment: "left",
          },
          spanCols: 1,
        })
      } else {
        cells.push({
          type: "decorative",
          style: { textSize: "sm", emphasis: "normal", alignment: "center" },
        })
      }
    }

    pages.push({
      pageNumber: p + 1,
      layout: "3x3",
      cells,
    })
  }

  return {
    totalPages,
    honoredName: tribute.honoredName,
    pages,
    designNotes: "Fallback sequential layout",
  }
}
