 'use client'
import Image from 'next/image';

export default function Lumi() {
  return (
    <>
    <p className="text-slate-400 leading-8 text-lg md:leading-10 mt-4 xl:pr-24 font-light mb-4">
    A frictionless todo/note taking app inspired by Whatsapp Groups.
  </p>
  <div className="flex justify-start mb-8">
    <button 
      className="bg-slate-700/80 text-slate-100 px-4 py-2 rounded-md" 
      onClick={() => {
        // Track the event
        // @ts-ignore
        window.gtag('event', 'download_click', {
          'event_category': 'engagement',
          'event_label': 'lumi_app_download'
        });
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = '/assets/lumi.apk';
        link.download = 'lumi.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }}
    >
      Download apk
    </button>
      </div>
      <Image src="/assets/projects/lumi.png" alt="Lumi" width={1000} height={1000} />
    </>
  );
} 