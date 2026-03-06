import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Seed design templates
  const templates = [
    {
      name: "Classic Ivory",
      description: "Timeless and warm",
      previewUrl: "/templates/classic-preview.jpg",
      theme: "classic",
      colorScheme: {
        primary: "#faf9f7",
        secondary: "#ffffff",
        accent: "#8b7355",
        border: "#d4c5a9",
        text: "#2d2d2d",
      },
      fontFamily: "Georgia, serif",
      borderStyle: "classic",
    },
    {
      name: "Dark Elegant",
      description: "Sophisticated and dignified",
      previewUrl: "/templates/dark-preview.jpg",
      theme: "dark",
      colorScheme: {
        primary: "#1a1a1a",
        secondary: "#2d2d2d",
        accent: "#c9a96e",
        border: "#444444",
        text: "#f0ede8",
      },
      fontFamily: "Georgia, serif",
      borderStyle: "minimal",
    },
    {
      name: "Garden Memorial",
      description: "Soft and nature-inspired",
      previewUrl: "/templates/floral-preview.jpg",
      theme: "floral",
      colorScheme: {
        primary: "#fdf6f0",
        secondary: "#fff9f5",
        accent: "#c17d5c",
        border: "#e8c9b0",
        text: "#3d2b1f",
      },
      fontFamily: "Georgia, serif",
      borderStyle: "floral",
    },
    {
      name: "Clean Minimalist",
      description: "Modern and understated",
      previewUrl: "/templates/minimalist-preview.jpg",
      theme: "minimalist",
      colorScheme: {
        primary: "#f5f5f5",
        secondary: "#ffffff",
        accent: "#666666",
        border: "#e0e0e0",
        text: "#1a1a1a",
      },
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      borderStyle: "none",
    },
  ]

  for (const template of templates) {
    await prisma.designTemplate.upsert({
      where: { id: `template-${template.theme}` },
      create: { id: `template-${template.theme}`, ...template },
      update: template,
    })
  }

  console.log(`Seeded ${templates.length} design templates`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
