import type { Metadata } from "next"
import "./globals.css"
import { SessionProvider } from "@/components/providers/session-provider"
import { DevToolbar } from "@/components/dev/dev-toolbar"
import {
  Playfair_Display,
  Lora,
  Dancing_Script,
  Merriweather,
  Libre_Baskerville,
  Crimson_Text,
  EB_Garamond,
  Josefin_Sans,
  Nunito,
  Caveat,
} from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" })
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" })
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing", display: "swap" })
const merriweather = Merriweather({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-merriweather", display: "swap" })
const libreBaskerville = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-libre", display: "swap" })
const crimson = Crimson_Text({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-crimson", display: "swap" })
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-garamond", display: "swap" })
const josefin = Josefin_Sans({ subsets: ["latin"], variable: "--font-josefin", display: "swap" })
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" })
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" })

export const metadata: Metadata = {
  title: "Love Cards — The Gift That Says Everything",
  description:
    "Collect messages and photos from everyone who loves them. We print every word as beautiful cards and deliver them in a keepsake box.",
  openGraph: {
    title: "Love Cards — The Gift That Says Everything",
    description: "Collect messages from everyone who loves them. Printed. Boxed. Unforgettable.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontVars = [
    playfair.variable, lora.variable, dancing.variable,
    merriweather.variable, libreBaskerville.variable, crimson.variable,
    ebGaramond.variable, josefin.variable, nunito.variable, caveat.variable,
  ].join(" ")

  return (
    <html lang="en">
      <body className={`antialiased min-h-screen bg-[#faf9f7] text-[#2d2d2d] pb-28 ${fontVars}`}>
        <SessionProvider>
          {children}
          {process.env.NODE_ENV !== "production" && <DevToolbar />}
        </SessionProvider>
      </body>
    </html>
  )
}
