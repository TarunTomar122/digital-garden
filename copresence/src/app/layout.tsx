import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Copresence from "@/components/Copresence";
import { getWhoopWidgetData } from "@/lib/whoop";
import { getAmbientMood } from "@/lib/ambient";

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
  title: "Tarats Garden",
  description: "Tarats digital garden — writings, projects, and notes",
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
