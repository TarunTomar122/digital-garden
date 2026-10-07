import type { Metadata } from "next";

export const SITE_URL = "https://www.tarat.space";
export const SITE_NAME = "Tarat's Garden";
export const SITE_DESCRIPTION =
  "Tarat's digital garden: AI and robotics projects, experiment logs, writings, books, and a timeline of things built and learned.";
export const SITE_TWITTER_HANDLE = "@tarat_211";

export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      creator: SITE_TWITTER_HANDLE,
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}
