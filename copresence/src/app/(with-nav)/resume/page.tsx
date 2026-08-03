import ResumePageClient from "@/components/ResumePageClient";

export const metadata = {
  title: "Resume",
  description: "Work, projects, and skills.",
};

export default function ResumePage() {
  return (
    <main className="raw-doc">
      <div className="raw-doc-inner" style={{ maxWidth: "760px" }}>
        <ResumePageClient />
      </div>
    </main>
  );
}