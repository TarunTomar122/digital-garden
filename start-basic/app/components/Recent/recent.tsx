import React from 'react';

interface RecentProps {
  iframeHtml: string;
}

export default function Recent({ iframeHtml }: RecentProps) {
  return (
    <>
      <p className="text-3xl md:text-4xl font-extralight py-4">Recent</p>
      <section className="mt-4">
        <p className="text-slate-400 leading-8 text-lg md:leading-10 xl:pr-24 font-light mb-2">I&apos;ve been recently obsessed with</p>
        <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />
      </section>
    </>
  );
}
