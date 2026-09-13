import TopNav from "@/components/TopNav";
import ScrollHeader from "@/components/ScrollHeader";
import SiteFooter from "@/components/SiteFooter";

export default function WithNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollHeader>
        <TopNav />
      </ScrollHeader>
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
