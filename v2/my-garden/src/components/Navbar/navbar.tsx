'use client'

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import { usePathname } from 'next/navigation'
import Link from 'next/link';

export default function Page() {
    const pathname = usePathname()
    return (
        <main className="flex flex-col items-center p-8">
            <h1 className="text-xl m-1">Tarun Tomar</h1>
            <h3 className='text-slate-400'>Design Engineer @Adobe</h3>
            <ul className='flex flex-row w-full justify-center gap-6 mt-4'>
                <li className={`link ${pathname === '/' ? 'border-b-2 border-b-slate-400' : ''}`}>
                    <Link href="/">
                        home
                    </Link>
                </li>
                <li>
                    <Link className={`link ${pathname === '/writings' ? 'border-b-2 border-b-slate-400' : ''}`} href="/writings">
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