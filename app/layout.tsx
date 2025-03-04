import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Variable } from "lucide-react"

const fontSans = localFont({
  src : "./fonts/MonaSans-VariableFont_wdth,wght.ttf"
})

export const metadata: Metadata = {
  title: "LuxeMarket | Premium Shopping Experience",
  description: "Discover the most extraordinary shopping experience",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

