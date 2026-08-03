import GardenMap from "@/components/GardenMap";

export const metadata = {
  title: "Garden Galaxy | Tarat's Garden",
  description: "A semantic map of my digital garden.",
};

export default function GardenPage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
       {/* Full viewport, no nav */}
      <GardenMap />
    </main>
  );
}
