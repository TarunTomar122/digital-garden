import type { Metadata } from 'next'
import './globals.css'

import Navbar from '../components/Navbar/navbar'

export const metadata: Metadata = {
  title: "TaraT's digital garden",
  description: 'A digital garden by TaraT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-vs">
        {children}
      </body>
    </html>
  )
}
