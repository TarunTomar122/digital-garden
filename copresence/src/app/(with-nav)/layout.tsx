import TopNav from "@/components/TopNav";

export default function WithNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {children}
    </>
  );
}


