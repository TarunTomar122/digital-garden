'use cache'
import { unstable_cacheLife as cacheLife } from 'next/cache'
import Image from 'next/image'
import { Suspense } from 'react';
import Recent from '../components/Recent/recent';
import SpotifyEmbedSkeleton from '../components/SpotifyEmbedSkeleton/spotifyEmbedSkeleton';
import Link from 'next/link';

export default async function Page() {
  cacheLife('days')
  return (
    <main className='flex justify-center xl:px-60'>
      <div className='min-w-full md:container md:mt-2 px-8  md:px-28 lg:px-60'>

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
          <section className="py-6">
            <Suspense fallback={
              <>
                <p className="text-3xl md:text-4xl font-extralight py-4">Recent</p>
                <section className="mt-4">
                  <p className='text-slate-400 leading-8 text-lg md:leading-10 xl:pr-24 font-light mb-2'>I've been recently obsessed with</p>
                  <SpotifyEmbedSkeleton />
                </section>
              </>

            }>
              <Recent />
            </Suspense>
          </section>

          {/* Footer */}
          <section className="py-8">
            <p>Made with 💛 by tarat</p>
          </section>

        </div>

      </div>

    </main >
  );
}
