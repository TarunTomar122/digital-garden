import ResumePageClient from "@/components/ResumePageClient";

export const metadata = {
  title: "Resume",
  description: "Work, projects, and skills.",
};

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <ResumePageClient />
    </main>
  );
}