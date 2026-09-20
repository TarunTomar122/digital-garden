import ResumeViewer from "@/components/ResumeViewer";
import { generateResumeHtml } from "@/lib/resume-generate";

export const metadata = {
  title: "Resume",
  description: "A story, not a traditional resume.",
};

export default async function ResumePage() {
  const { html } = await generateResumeHtml();

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner" style={{ maxWidth: "860px" }}>
        <header className="page-head">
          <p className="page-kicker">About</p>
          <h1>Resume</h1>
          <p className="note">
            A story, not a traditional resume. Prefer plain text? Grab the{" "}
            <a href="/resume.txt">txt version</a>.
          </p>
        </header>
        <ResumeViewer html={html} />
      </div>
    </main>
  );
}
