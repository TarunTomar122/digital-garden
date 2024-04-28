'use client'

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Page() {
  const pathname = usePathname()
  return (
    <main className="min-h-14 border-b-2 border-slate-200 flex flex-row items-center justify-between font-vs px-7 md:px-48 lg:px-96">
      <ul className='flex flex-row w-full justify-center gap-6'>
        <li>
          <Link className={`link ${pathname === '/' ? 'text-red-500' : ''}`} href="/">
            home
          </Link>
        </li>
        {/* <li>
          <Link
            className={`link ${pathname === '/projects' ? 'text-red-500' : ''}`}
            href="/projects"
          >
            projects
          </Link>
        </li> */}
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
        {/* <li>
          <Link
            className={`link cursor-alias ${pathname === '/hobbies' ? 'text-red-500' : ''}`}
            href="https://www.instagram.com/tarat.life/"
            target='_blank'
          >
            hobbies
          </Link>
        </li> */}
      </ul>

      {/* <div className='hidden sm:block'>
        <img src="./assets/profile.png" alt="profile" className='h-8 w-8 rounded-2xl' />
      </div> */}

    </main>
  )
}
