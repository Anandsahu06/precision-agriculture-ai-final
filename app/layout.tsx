import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalysisProvider } from "@/lib/analysis-context"
import { Navbar } from "@/components/navbar"

import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "AgriVision - Precision Agriculture Analytics",
  description:
    "AI-powered precision agriculture platform using drone imagery for crop health monitoring, NDVI analysis, and actionable farming insights.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a7a4c" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1a10" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_inter.variable} ${_spaceMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AnalysisProvider>
            <Navbar />
            <main>{children}</main>
          </AnalysisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
