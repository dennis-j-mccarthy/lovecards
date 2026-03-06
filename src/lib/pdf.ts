import { CardLayoutResponse, CardCell } from "./anthropic"
import { Contribution, DesignTemplate, Tribute } from "@prisma/client"

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
    border: 1px solid ${theme.border};
    border-radius: 4px;
    background: ${theme.cardBg};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${cell.style.alignment === "center" ? "center" : "flex-start"};
    padding: 16px;
    box-sizing: border-box;
  `

  const textSizes: Record<string, string> = {
    sm: "11px",
    md: "13px",
    lg: "16px",
  }
  const fontSize = textSizes[cell.style.textSize] ?? "13px"

  if (cell.type === "honored_photo" && tribute.honoredPhoto) {
    return `<div style="${baseStyle} padding: 0;">
      <img src="${tribute.honoredPhoto}" alt="${tribute.honoredName}"
           style="width: 100%; height: 100%; object-fit: cover;" />
    </div>`
  }

  if (cell.type === "title_cell") {
    return `<div style="${baseStyle} text-align: center; align-items: center; background: ${theme.bg};">
      <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: ${theme.accent}; margin: 0 0 8px;">In Loving Memory</p>
      <h2 style="font-size: 20px; font-weight: normal; color: ${theme.text}; margin: 0; font-family: Georgia, serif;">${tribute.honoredName}</h2>
      ${tribute.location ? `<p style="font-size: 10px; color: ${theme.accent}; margin: 6px 0 0;">${tribute.location}</p>` : ""}
    </div>`
  }

  if (cell.type === "decorative") {
    return `<div style="${baseStyle} align-items: center; background: ${theme.bg};">
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
      return `<div style="${baseStyle} padding: 0; position: relative;">
        <img src="${contrib.photoUrl}" alt="Memory from ${name}"
             style="width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 10px;
                    background: linear-gradient(transparent, rgba(0,0,0,0.6));">
          <p style="color: white; font-size: 9px; margin: 0; font-style: italic;">— ${name}</p>
        </div>
      </div>`
    }

    return `<div style="${baseStyle}">
      ${hasPhoto ? `<img src="${contrib!.photoUrl}" alt="Photo" style="width: 100%; height: 80px; object-fit: cover; border-radius: 2px; margin-bottom: 10px;" />` : ""}
      ${cell.content ? `<p style="font-size: ${fontSize}; line-height: 1.6; color: ${theme.text}; margin: 0 0 10px; font-family: Georgia, serif; font-style: italic;">
        &ldquo;${cell.content}&rdquo;
      </p>` : ""}
      <p style="font-size: 9px; color: ${theme.accent}; margin: 0; letter-spacing: 1px; text-transform: uppercase;">— ${name}</p>
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
      // Build grid rows — group cells into rows of 3
      const cells = page.cells
      let gridContent = ""
      let cellIdx = 0

      while (cellIdx < cells.length) {
        const cell = cells[cellIdx]
        const spanCols = cell.spanCols ?? 1

        const cellHeight = spanCols === 3 ? "200px" : "290px"
        const cellStyle = `
          grid-column: span ${spanCols};
          height: ${cellHeight};
        `

        gridContent += `<div style="${cellStyle}">${renderCell(cell, tribute, theme)}</div>`
        cellIdx++
      }

      return `<div style="
        width: 816px;
        height: 1056px;
        background: ${theme.bg};
        box-sizing: border-box;
        padding: 48px;
        page-break-after: always;
        position: relative;
      ">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid ${theme.border};">
          <p style="font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: ${theme.accent}; margin: 0;">
            In Loving Memory of ${tribute.honoredName}
          </p>
        </div>

        <!-- 3x3 Grid -->
        <div style="
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          height: calc(100% - 100px);
        ">
          ${gridContent}
        </div>

        <!-- Footer -->
        <div style="position: absolute; bottom: 32px; left: 48px; right: 48px; text-align: center; border-top: 1px solid ${theme.border}; padding-top: 12px;">
          <p style="font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: ${theme.accent}; margin: 0;">
            Page ${page.pageNumber} of ${layout.totalPages}
          </p>
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
  // Dynamic import to avoid issues in non-serverless environments during dev
  const puppeteer = await import("puppeteer-core")
  const chromium = await import("@sparticuz/chromium")

  const browser = await puppeteer.default.launch({
    args: chromium.default.args,
    executablePath: await chromium.default.executablePath(),
    headless: true,
  })

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
