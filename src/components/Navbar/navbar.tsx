'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Page() {
  const pathname = usePathname()
  return (
    <main className="min-h-14 border-b-2 border-slate-200 flex items-center flex-col justify-center font-vs">
      <ul className='flex flex-column justify-end gap-6'>
        <li>
          <Link className={`link ${pathname === '/' ? 'text-red-500' : ''}`} href="/">
            home
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === '/projects' ? 'text-red-500' : ''}`}
            href="/projects"
          >
            projects
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === '/hobbies' ? 'text-red-500' : ''}`}
            href="/hobbies"
          >
            hobbies
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
      </ul>
    </main>
  )
}
