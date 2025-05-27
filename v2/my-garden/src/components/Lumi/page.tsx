 'use client'
import Image from 'next/image';

export default function Lumi() {
  return (
    <>
    <h2 className='text-2xl text-slate-200 my-2'>Lumi</h2>
    <p className='text-slate-400'>A frictionless todo/note taking app inspired by Whatsapp Groups. Currently in beta.</p>
    <div className="flex justify-start my-6">
        <button 
        className="bg-slate-700/80 text-slate-100 px-4 py-2 rounded-md" 
        onClick={() => {
            // Track the event
            // @ts-ignore
            window.gtag('event', 'download_click', {
            'event_category': 'engagement',
            'event_label': 'lumi_app_download'
            });

            window.location.href = 'https://drive.google.com/uc?export=download&id=1jD7lDinQwZKT5Q5jh2oQbsupA71EsyK3';
        }}
        >
        📥 󠀠󠀠󠀠󠀠 󠀠Download beta (Android)
        </button>
      </div>
      <Image src="/assets/projects/lumi/wireframes.png" alt="Lumi" width={1000} height={1000} />
    </>
  );
} 
