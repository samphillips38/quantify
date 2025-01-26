import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MainNav } from "@/components/main-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quantify - Financial Optimization",
  description: "Optimize your savings and investments with Quantify",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <MainNav />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}

