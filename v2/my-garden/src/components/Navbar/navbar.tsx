'use client'

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import { usePathname } from 'next/navigation'
import Link from 'next/link';

export default function Page() {
    const pathname = usePathname()
    return (
        <main className="flex flex-col p-16 px-6 md:px-24 lg:px-48 xl:px-96 mb-6">
            <a className="text-2xl cursor-pointer" href='https://bento.me/tarat' target='_blank'>Tarun Tomar</a>
            <p className='text-slate-400 text-lg'>Design Engineer @Adobe</p>
            <ul className='flex flex-row w-full gap-6 mt-4'>
                <li className={`link ${pathname === '/' ? 'border-b-2 border-b-slate-400' : ''}`}>
                    <Link href="/">
                        home
                    </Link>
                </li>
                <li>
                    <Link className={`link ${pathname.startsWith('/writings') ? 'border-b-2 border-b-slate-400' : ''}`} href="/writings">
                        writings
                    </Link>
                </li>
                <li>
                    <Link className={`link ${pathname === '/library' ? 'border-b-2 border-b-slate-400' : ''}`} href="/library">
                        library
                    </Link>
                </li>
                <li>
                    <Link className={`link ${pathname === '/dump' ? 'border-b-2 border-b-slate-400' : ''}`} href="/dump">
                        dump
                    </Link>
                </li>
            </ul>
        </main>
    )

}