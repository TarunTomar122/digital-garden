import type { Metadata } from 'next'
import './globals.css'

import Navbar from '../components/Navbar/navbar'
import PostHogProvider from '../components/PostHogProvider'

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
      <PostHogProvider>
      <Navbar />
        {children}
      </PostHogProvider>
      </body>
    </html>
  )
}
