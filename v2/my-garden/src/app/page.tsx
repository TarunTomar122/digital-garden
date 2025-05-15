'use cache'
import { unstable_cacheLife as cacheLife } from 'next/cache'
import Image from 'next/image'
import { Suspense } from 'react';
import Recent from '../components/Recent/recent';
import SpotifyEmbedSkeleton from '../components/SpotifyEmbedSkeleton/spotifyEmbedSkeleton';
import Link from 'next/link';
import { getAllWritings } from '@/actions/writingsActions';

export default async function Page() {
  cacheLife('seconds')
  const writings = await getAllWritings();

  // order the writings by date
  writings.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Get only the latest 2 writings
  const latestWritings = writings.slice(0, 2);

  return (
    <main className='flex justify-center xl:px-40 2xl:px-60'>
      <div className='min-w-full md:container md:mt-2 px-8  md:px-28 lg:px-60 xl:px-120'>

        {/* Present */}
        <div>
          <section>
            <div className='flex flex-row items-center justify-between'>
              <p className="text-3xl md:text-4xl font-extralight py-4">Present</p>
              <Image 
                src="/selfie.png" 
                alt='TaraT' 
                width={64} 
                height={64} 
                className='h-12 md:h-16 rounded-full w-auto'
                priority={true}
              />
            </div>
            <section className="text-slate-400 leading-8 text-lg md:leading-10 mt-4 xl:pr-24 font-light">
              <p>Tarat is currently helping ship {" "}
                <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <Link href="https://s2.spectrum.adobe.com/index.html" target="_blank">Spectrum 2 @Adobe</Link>
                </span> {" "} but also, he is writing weekly newsletters on substack as {" "}
                <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <Link href="https://tarat122.substack.com/" target="_blank">tarat's week on internet</Link>
                </span>, documenting hobbies on instagram as <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <Link href="https://www.instagram.com/tarat.hobbies/" target="_blank">tarat.hobbies</Link>
                </span> {", "} <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <Link href="/writings">writing blogs</Link>
                </span>{", "} <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <Link href="/library">reading books</Link>
                </span>
                {" and, "}
                <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <Link href="/projects">creating half finished projects.</Link>
                </span>
              </p>
            </section>
          </section>

          {/* Recent */}
          <p className="text-3xl md:text-4xl font-extralight py-4 pt-10">Featured</p>
          <div className="flex flex-col md:flex-row justify-between items-start">
          <section className="mt-4 mb-8 md:mb-6">
                <div className="space-y-6">
                    {latestWritings.map(({ id, title, description, date }) => (
                        <Link key={id} href={`/writings/${id}`} className="block group">
                               <article className="border-b border-slate-700/60 hover:border-slate-200/60">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h2 className="text-xl text-slate-200 group-hover:text-white transition-colors">
                                        {title.length > 70 ? title.slice(0, 70) + "..." : title}
                                    </h2>
                                    <span className="text-slate-500 group-hover:text-slate-400 transition-colors flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                                            <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
                                        </svg>
                                    </span>
                                </div>
                                <time className="text-sm text-slate-500 mb-3 block">
                                    {date.toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </time>
                                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 group-hover:text-slate-300 transition-colors">
                                    {description}
                                </p>
                            </article>
                        </Link>
                    ))}
                </div>
            </section>
             <Suspense fallback={
                <>
                  <section className="mt-6">
                    <SpotifyEmbedSkeleton />
                  </section>
                </>

              }>
                <div className="flex flex-col justify-start w-full mb-8 md:w-1/2 md:pl-12 md:pt-3">
                  <p className="text-slate-400 mb-2">I've been recently obsessed with</p>
                  <Recent />
                </div>
              </Suspense>
          </div>

          {/* Footer */}
          <section className="py-8">
            <p className='text-slate-400'>Copyright © 2025 Tarat</p>
          </section>
        </div>
      </div>
    </main >
  );
}
