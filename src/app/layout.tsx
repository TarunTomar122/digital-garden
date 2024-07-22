import type { Metadata } from 'next'
import './globals.css'

import Navbar from '../components/Navbar/navbar'

export const metadata: Metadata = {
  title: "tarat",
  description: 'Personal website of TaraT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-vs">
      <Navbar />
        {children}
      </body>
    </html>
  )
}
