import TopNav from "@/components/TopNav";
import ScrollHeader from "@/components/ScrollHeader";

export default function WithNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fff" }}>
      <ScrollHeader>
        <TopNav />
      </ScrollHeader>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
