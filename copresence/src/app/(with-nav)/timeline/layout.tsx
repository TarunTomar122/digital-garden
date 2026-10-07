import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/timeline",
  "Timeline",
  "Follow Tarat's timeline of projects, experiments, milestones, and things learned, organized by year."
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
