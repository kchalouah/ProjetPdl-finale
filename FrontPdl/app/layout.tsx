import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ApiErrorBoundary } from "@/components/api-error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DMIC - Dossier Médical Collaboratif",
  description: "Système de gestion de dossier médical collaboratif",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ApiErrorBoundary>{children}</ApiErrorBoundary>
      </body>
    </html>
  )
}
