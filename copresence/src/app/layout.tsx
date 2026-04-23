import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Copresence from "@/components/Copresence";
import { getWhoopWidgetData } from "@/lib/whoop";
import { getAmbientMood } from "@/lib/ambient";
import {
  DEFAULT_OG_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TWITTER_HANDLE,
  SITE_URL,
} from "@/lib/site";

import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
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

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const whoop = await getWhoopWidgetData();
  const sleepHours = whoop.status === "connected" ? whoop.sleepHours : null;
  const ambient = getAmbientMood(sleepHours);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-1000`}
        style={{
          "--background": ambient.background,
          backgroundColor: ambient.background,
          filter: `saturate(${ambient.pageSaturation})`,
        } as CSSProperties}
      >
        <Copresence />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
