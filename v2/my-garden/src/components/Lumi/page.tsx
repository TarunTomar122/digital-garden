'use client'
import Image from 'next/image';

export default function Lumi() {
  return (
    <>
    <h2 className='text-3xl text-slate-200 my-2'>Lumi</h2>
    <p className='text-slate-400 text-lg'>The simplest way to manage todos, notes and track habits.</p>
    <p className='text-slate-400 my-1 text-lg'>NOTE: The app is in closed beta rn so if you wanna join, send me your email on <a href="https://www.instagram.com/tarat.hobbies/" target="_blank" className='text-slate-200'>instagram</a>.</p>
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

            window.location.href = 'https://play.google.com/store/apps/details?id=com.lumi.mobile';
        }}
        >
        📥 󠀠󠀠󠀠󠀠 󠀠Download from Play Store
        </button>
      </div>
    </>
  );
} 
