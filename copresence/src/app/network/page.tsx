import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/network",
  "Garden Galaxy",
  "Explore connections between Tarat's projects, writings, and work experience in an interactive semantic map of the garden."
);

import GardenMap from "@/components/GardenMap";


export default function GardenPage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
       {/* Full viewport, no nav */}
      <GardenMap />
    </main>
  );
}
