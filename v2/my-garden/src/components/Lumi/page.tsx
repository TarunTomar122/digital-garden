'use client'
import Image from 'next/image';

export default function Lumi() {
  return (
    <>
    <h2 className='text-2xl text-slate-200 my-2'>Lumi</h2>
    <p className='text-slate-400'>A frictionless todo/note taking app inspired by Whatsapp Groups.</p>
    <p className='text-slate-400 my-2'>NOTE: This app is currently in closed beta. If you want to join the beta, please send me your email on <a href="https://www.instagram.com/tarat.hobbies/" target="_blank" className='text-slate-200'>instagram</a>.</p>
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
      <Image src="https://private-user-images.githubusercontent.com/54112921/453030682-226763cf-9eba-42b6-abdc-936739756b7d.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDk1MjI3NDEsIm5iZiI6MTc0OTUyMjQ0MSwicGF0aCI6Ii81NDExMjkyMS80NTMwMzA2ODItMjI2NzYzY2YtOWViYS00MmI2LWFiZGMtOTM2NzM5NzU2YjdkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA2MTAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjEwVDAyMjcyMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTI0N2U4MTRmYzdjMDdhYWY0YjAzM2QxYmQ2OTgyOGRkMjk4OGY1OTZkYjllZmUwNjU0NzBkOGZkNTk1NDI5OGUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.XmROd4fF9xEKA2tZeRTqc1dMu4zsA0GDdIy3VCSFYc8" alt="Lumi" width={1000} height={1000} />
    </>
  );
} 
