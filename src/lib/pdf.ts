import { CardLayoutResponse, CardCell } from "./anthropic"
import { Contribution, DesignTemplate, Tribute } from "@prisma/client"
import path from "path"
import { readFileSync } from "fs"

function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  if (url.startsWith("/")) {
    // Convert local file to base64 data URI
    try {
      const filePath = path.join(process.cwd(), "public", url)
      const buffer = readFileSync(filePath)
      const ext = path.extname(url).slice(1) || "png"
      const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`
      return `data:${mime};base64,${buffer.toString("base64")}`
    } catch {
      return url
    }
  }
  return url
}

type TributeWithContributions = Tribute & {
  contributions: Contribution[]
  template: DesignTemplate | null
}

const DESIGN_THEMES: Record<
  string,
  { bg: string; cardBg: string; text: string; accent: string; border: string }
> = {
  classic: {
    bg: "#faf9f7",
    cardBg: "#ffffff",
    text: "#2d2d2d",
    accent: "#8b7355",
    border: "#d4c5a9",
  },
  dark: {
    bg: "#1a1a1a",
    cardBg: "#2d2d2d",
    text: "#f0ede8",
    accent: "#c9a96e",
    border: "#444",
  },
  floral: {
    bg: "#fdf6f0",
    cardBg: "#fff9f5",
    text: "#3d2b1f",
    accent: "#c17d5c",
    border: "#e8c9b0",
  },
  minimalist: {
    bg: "#f5f5f5",
    cardBg: "#ffffff",
    text: "#1a1a1a",
    accent: "#666",
    border: "#e0e0e0",
  },
}

function renderCell(
  cell: CardCell,
  tribute: TributeWithContributions,
  theme: (typeof DESIGN_THEMES)[string]
): string {
  const baseStyle = `
    border: none;
    background: white;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 16px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  `

  const textSizes: Record<string, string> = {
    sm: "11px",
    md: "13px",
    lg: "16px",
  }
  const fontSize = textSizes[cell.style.textSize] ?? "13px"

  if (cell.type === "honored_photo" && tribute.honoredPhoto) {
    return `<div style="${baseStyle} padding: 0;">
      <img src="${resolveImageUrl(tribute.honoredPhoto)}" alt="${tribute.honoredName}"
           style="width: 100%; height: 100%; object-fit: cover;" />
    </div>`
  }

  if (cell.type === "title_cell") {
    return `<div style="${baseStyle} text-align: center; align-items: center;">
      <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: ${theme.accent}; margin: 0 0 8px;">In Loving Memory</p>
      <h2 style="font-size: 20px; font-weight: normal; color: ${theme.text}; margin: 0; font-family: Georgia, serif;">${tribute.honoredName}</h2>
      ${tribute.location ? `<p style="font-size: 10px; color: ${theme.accent}; margin: 6px 0 0;">${tribute.location}</p>` : ""}
    </div>`
  }

  if (cell.type === "decorative") {
    return `<div style="${baseStyle} align-items: center;">
      <span style="font-size: 24px; opacity: 0.3;">✦</span>
    </div>`
  }

  if (cell.type === "contribution") {
    const name = cell.isAnonymous
      ? "Anonymous"
      : cell.contributorName ?? "A friend"

    // Find the contribution to get the photo
    const contrib = cell.contributionId
      ? tribute.contributions.find((c) => c.id === cell.contributionId)
      : null

    const hasPhoto = contrib?.photoUrl && (contrib.type === "PHOTO" || contrib.type === "TEXT_AND_PHOTO")

    if (contrib?.type === "PHOTO" && !contrib.message) {
      const photoAvatarUrl = !cell.isAnonymous && contrib?.avatarUrl ? resolveImageUrl(contrib.avatarUrl) : null
      return `<div style="${baseStyle} padding: 0; position: relative;">
        <img src="${resolveImageUrl(contrib.photoUrl)}" alt="Memory from ${name}"
             style="width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 10px;
                    background: linear-gradient(transparent, rgba(0,0,0,0.6)); display: flex; align-items: center; justify-content: center;">
          ${photoAvatarUrl ? `<img src="${photoAvatarUrl}" alt="${name}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; margin-right: 6px; border: 1px solid rgba(255,255,255,0.5);" />` : ""}
          <p style="color: white; font-size: 9px; margin: 0; font-style: italic;">— ${name}</p>
        </div>
      </div>`
    }

    const avatarUrl = !cell.isAnonymous && contrib?.avatarUrl ? resolveImageUrl(contrib.avatarUrl) : null
    const avatarHtml = avatarUrl
      ? `<img src="${avatarUrl}" alt="${name}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; margin-right: 6px;" />`
      : ""

    return `<div style="${baseStyle}">
      ${hasPhoto ? `<img src="${resolveImageUrl(contrib!.photoUrl)}" alt="Photo" style="width: 100%; height: 80px; object-fit: cover; border-radius: 2px; margin-bottom: 10px;" />` : ""}
      ${cell.content ? `<p style="font-size: ${fontSize}; line-height: 1.6; color: ${theme.text}; margin: 0 0 10px; font-family: Georgia, serif; font-style: italic;">
        &ldquo;${cell.content}&rdquo;
      </p>` : ""}
      <div style="display: flex; align-items: center; justify-content: center; margin-top: auto;">
        ${avatarHtml}
        <p style="font-size: 9px; color: ${theme.accent}; margin: 0; letter-spacing: 1px; text-transform: uppercase;">— ${name}</p>
      </div>
    </div>`
  }

  return `<div style="${baseStyle}"></div>`
}

export function renderCardPagesHTML(
  layout: CardLayoutResponse,
  tribute: TributeWithContributions
): string {
  const themeName = tribute.template?.theme ?? "classic"
  const theme = DESIGN_THEMES[themeName] ?? DESIGN_THEMES.classic

  const pagesHtml = layout.pages
    .map((page) => {
      const cells = page.cells
      let gridContent = ""

      for (const cell of cells) {
        gridContent += `<div style="
          display: flex;
          align-items: center;
          justify-content: center;
        ">${renderCell(cell, tribute, theme)}</div>`
      }

      // Pad to 9 cells for consistent grid
      const cellCount = cells.length
      for (let i = cellCount; i < 9; i++) {
        gridContent += `<div></div>`
      }

      return `<div style="
        width: 816px;
        height: 1056px;
        background: white;
        box-sizing: border-box;
        padding: 24px;
        page-break-after: always;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 0px;
          width: 100%;
          height: 100%;
        ">
          ${gridContent}
        </div>
      </div>`
    })
    .join("\n")

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; background: #ccc; }
    @media print {
      body { background: white; }
      .page { page-break-after: always; }
    }
  </style>
</head>
<body>
  ${pagesHtml}
</body>
</html>`
}

export async function generateMemorialPDF(
  layout: CardLayoutResponse,
  tribute: TributeWithContributions
): Promise<Buffer> {
  // Use regular puppeteer locally, @sparticuz/chromium in production
  let browser
  if (process.env.NODE_ENV === "production") {
    const puppeteer = await import("puppeteer-core")
    const chromium = await import("@sparticuz/chromium")
    browser = await puppeteer.default.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    })
  } else {
    const puppeteer = await import("puppeteer")
    browser = await puppeteer.default.launch({ headless: true })
  }

  try {
    const page = await browser.newPage()

    // 8.5 x 11 inches at 96 DPI = 816 x 1056px
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 })

    const html = renderCardPagesHTML(layout, tribute)

    await page.setContent(html, { waitUntil: "networkidle0" })

    // Wait for all images to load
    await page.evaluate(() =>
      Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise<void>((resolve) => {
                img.onload = () => resolve()
                img.onerror = () => resolve()
              })
          )
      )
    )

    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    })

    return Buffer.from(pdfBuffer)
  } finally {
    await browser.close()
  }
}
