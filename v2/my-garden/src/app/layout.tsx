import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-4805E8Y26L`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4805E8Y26L');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
