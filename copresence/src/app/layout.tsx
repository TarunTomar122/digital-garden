import type { Metadata } from "next";
import { Domine, Geist_Mono } from "next/font/google";
import "./globals.css";
import Copresence from "@/components/Copresence";
import {
  DEFAULT_OG_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TWITTER_HANDLE,
  SITE_URL,
} from "@/lib/site";

import { Analytics } from "@vercel/analytics/next"

const domine = Domine({
  variable: "--font-domine",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
      },
    ],
  },
  twitter: {
    card: "summary",
    creator: SITE_TWITTER_HANDLE,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  icons: {
    icon: "/tarat.svg",
    shortcut: "/tarat.svg",
    apple: "/tarat.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${domine.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
          <Copresence />
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
