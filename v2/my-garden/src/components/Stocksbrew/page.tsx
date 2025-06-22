'use client'
import Image from 'next/image';

export default function Lumi() {
  return (
    <>
    <h2 className='text-3xl text-slate-200 my-2 mt-10'>Stocksbrew</h2>
    <p className='text-slate-400 text-lg'>Your personalized portfolio insights delivered straight to your inbox, everyday at 6 AM.</p>
    <div className="flex justify-start my-6">
        <button 
        className="bg-slate-700/80 text-slate-100 px-4 py-2 rounded-md" 
        onClick={() => {
            // Track the event
            // @ts-ignore
            window.gtag('event', 'newsletter_launch', {
            'event_category': 'engagement',
            'event_label': 'stocksbrew_newsletter_launch'
            });

            window.location.href = 'https://stocksbrew.vercel.app/';
        }}
        >
         🚀 󠀠󠀠󠀠󠀠 󠀠Launch my newsletter
        </button>
      </div>
      {/* <Image src="/assets/projects/stocksbrew/homepage.png" alt="Stocksbrew" width={1000} height={1000}/> */}
    </>
  );
} 