"use client";

import dynamic from "next/dynamic";

const ResumeViewer = dynamic(() => import("@/components/ResumeViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-muted text-sm">ai is generating a resume :)</p>
    </div>
  ),
});

export default function ResumePageClient() {
  return <ResumeViewer />;
}