import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/tarat-ai",
  "Tarat AI",
  "Ask Tarat AI questions about Tarat's projects, writings, books, goals, and work experience using content from the garden."
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
