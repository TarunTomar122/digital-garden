import ResumeViewer, { ResumeDownloadButton } from "@/components/ResumeViewer";
import { generateResumeHtml } from "@/lib/resume-generate";

export const metadata = {
  title: "Resume",
  description: "I'd rather tell you my story",
};

export default async function ResumePage() {
  const { html } = await generateResumeHtml();

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner" style={{ maxWidth: "860px" }}>
        <header className="page-head">
          <div className="resume-page-title-row">
            <h1>Resume</h1>
            <ResumeDownloadButton html={html} />
          </div>
          <p className="note">
            Resumes are useless... I'd rather tell you my story.
          </p>
        </header>
        <ResumeViewer html={html} />
      </div>
    </main>
  );
}
