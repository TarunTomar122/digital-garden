 'use client'
import Image from 'next/image';

export default function Lumi() {
  return (
    <>
    <p className="text-slate-400 leading-8 text-lg md:leading-2 mt-4 xl:pr-24 font-light mb-4">
    A frictionless todo/note taking app inspired by Whatsapp Groups. Currently in beta with limited features and unlimited bugs and will be available on the play store soon.
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
        
        window.location.href = 'https://drive.google.com/uc?export=download&id=1NbdJklM6wB9SoO8BaEDiTWMGj3t0yHWE';
      }}
    >
      Download beta apk
    </button>
      </div>
      <Image src="/assets/projects/lumi/lumi.png" alt="Lumi" width={1000} height={1000} />
    </>
  );
} 