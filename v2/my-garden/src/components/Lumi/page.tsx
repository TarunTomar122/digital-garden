'use client'
import Image from 'next/image';

export default function Lumi() {
  return (
    <>
    <h2 className='text-3xl text-slate-200 my-2'>Lumi</h2>
    <p className='text-slate-400 text-lg'>
      A minimal, chat-based productivity app that lets you manage tasks, jot down notes, reflect daily, and track habits. 
    </p>
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
        📥 󠀠󠀠󠀠󠀠 󠀠󠀠󠀠󠀠Try on Play Store
        </button>
      </div>
    </>
  );
} 
