import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from '../components/Navbar/navbar'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaraT",
  description: "tarat's digital garden",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon.ico' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="md:font-light">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
