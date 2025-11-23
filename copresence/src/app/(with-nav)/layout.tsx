import TopNav from "@/components/TopNav";

export default function WithNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div id="top-nav" className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-muted/20">
        <TopNav />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
