'use client'

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Page() {
  const pathname = usePathname()
  return (
    <main className="">

      <a href="bento.com/tarat" target="_blank" className="cursor-alias leading-relaxed font-bold">tarat</a>

      <ul className='flex flex-row w-full justify-center gap-6'>
        <li>
          <Link className={`link ${pathname === '/' ? 'text-red-500' : ''}`} href="/">
            home
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === '/reading' ? 'text-red-500' : ''}`}
            href="/reading"
          >
            reading
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === '/writing' ? 'text-red-500' : ''}`}
            href="/writing"
          >
            writing
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === '/list100' ? 'text-red-500' : ''}`}
            href="/list100"
          >
            list 100
          </Link>
        </li>
      </ul>

    </main>
  )
}
