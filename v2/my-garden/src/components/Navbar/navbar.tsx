'use client'

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import { usePathname } from 'next/navigation'
import Link from 'next/link';

export default function Page() {
    const pathname = usePathname()

    return (
        <main className='flex justify-center xl:px-60'>
            <div className='min-w-full md:container flex flex-row justify-center py-12 px-8  md:px-28 lg:px-60'>

                <div className="mx-auto flex flex-wrap items-center justify-between min-w-full">

                    <a href="/" className="flex">
                        <img className='cursor-pointer h-10' src="./montarat.svg" alt='TaraT' />
                    </a>

                    <button data-collapse-toggle="mobile-menu" type="button" className="md:hidden ml-3 text-gray-400 focus:outline-none rounded-lg inline-flex items-center justify-center" aria-controls="mobile-menu-2" aria-expanded="false" onClick={() => {
                        // find id mobile-menu and toggle it
                        const mobileMenu = document.getElementById('mobile-menu')
                        // toggle class hidden on it
                        mobileMenu?.classList.toggle('hidden')
                    }}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                        <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>

                    <div className="hidden md:block w-full md:w-auto text-gray-400 pt-4 md:pt-0" id="mobile-menu">
                        <ul className="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 gap-4 md:gap-0 text-md md:text-lg md:font-light">

                            <li className={`link ${pathname === '/' ? 'text-white font-regular' : ''}`}>
                                <Link href="/" onClick={() => {
                                    const mobileMenu = document.getElementById('mobile-menu')
                                    mobileMenu?.classList.toggle('hidden')
                                }}>
                                    home
                                </Link>
                            </li>

                            <li>
                                <Link className={`link ${pathname.startsWith('/writings') ? 'text-white font-regular' : ''}`} href="/writings" onClick={() => {
                                    const mobileMenu = document.getElementById('mobile-menu')
                                    mobileMenu?.classList.toggle('hidden')
                                }}>
                                    writings
                                </Link>
                            </li>

                            <li>
                                <Link className={`link ${pathname === '/library' ? 'text-white font-regular' : ''}`} href="/library" onClick={() => {
                                    const mobileMenu = document.getElementById('mobile-menu')
                                    mobileMenu?.classList.toggle('hidden')
                                }}>
                                    library
                                </Link>
                            </li>

                            <li>
                                <Link className={`link ${pathname === '/experience' ? 'text-white font-regular' : ''}`} href="/experience" onClick={() => {
                                    const mobileMenu = document.getElementById('mobile-menu')
                                    mobileMenu?.classList.toggle('hidden')
                                }}>
                                    experience
                                </Link>
                            </li>

                        </ul>
                    </div>
                </div>

            </div>
        </main>
    )

    return (

        <main className='border-2 border-red-500 flex justify-center'>

            <div className='border-2 border-green-500 container flex flex-row justify-center gap-4 items-center py-8'>

                <Link href='https://bento.me/tarat' target='_blank'>
                    <img className='cursor-pointer h-4' src="./tarat.svg" alt='TaraT' />
                </Link>


                <div className='text-xs text-gray-400 flex flex-row sm:gap-6 gap-4 mt-4 min-h-full '>

                    <li className={`link ${pathname === '/' ? 'text-white font-regular' : ''}`}>
                        <Link href="/">
                            home
                        </Link>
                    </li>
                    <p>
                        <Link className={`link ${pathname.startsWith('/writings') ? 'text-white font-regular' : ''}`} href="/writings">
                            writings
                        </Link>
                    </p>
                    <p>
                        <Link className={`link ${pathname === '/library' ? 'text-white font-regular' : ''}`} href="/library">
                            library
                        </Link>
                    </p>
                    <p>
                        <Link className={`link ${pathname === '/experience' ? 'text-white font-regular' : ''}`} href="/experience">
                            experience
                        </Link>
                    </p>

                </div>

            </div>

        </main>
    )

}