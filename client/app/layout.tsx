import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { SupportChatProvider } from "@/contexts/SupportChatContext"
import SupportChatModal from "@/components/shared/SupportChatModal"
import FloatingSupportButton from "@/components/shared/FloatingSupportButton"

export const metadata: Metadata = {
  title: "Election & Census Management System",
  description: "Professional system for managing elections and census operations",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <SupportChatProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <FloatingSupportButton />
              <SupportChatModal />
            </ThemeProvider>
          </SupportChatProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
