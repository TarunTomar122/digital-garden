'use client'
import Image from 'next/image';

export default function Lumi() {
  return (
    <>
    <h2 className='text-3xl text-slate-200 my-2'>Lumi</h2>
    <p className='text-slate-400 text-lg'>The simplest way to manage todos, notes and track habits.</p>
    <p className='text-slate-200 text-lg border-l-2 border-slate-500 pl-2 my-4'>After multiple rounds of beta testing and community feedback, Lumi is now live for everyone! Thanks to all beta testers who helped shape Lumi into what it is today. This is just the beginning 🚀</p>
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

            window.location.href = 'https://play.google.com/store/apps/details?id=com.lumi.mobile&pcampaignid=web_share';
        }}
        >
        📥 󠀠󠀠󠀠󠀠 󠀠Download from Play Store
        </button>
      </div>
    </>
  );
} 
