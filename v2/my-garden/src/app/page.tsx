'use cache'
import { unstable_cacheLife as cacheLife } from 'next/cache'
import Link from 'next/link';
import { getAllWritings } from '@/actions/writingsActions';

export default async function Page() {
  cacheLife('seconds')

  const featured = [
    {
      title: 'Instafy',
      description:
        'Turn Your Ordinary Photographs Into Instagram Photoshoots',
      href: 'https://instafy-six.vercel.app/',
      external: true,
    },
    {
      title: 'Stocksbrew',
      description:
        'AI-powered newsletter that tracks your stocks and ships updates automatically.',
      href: 'https://stocksbrew.vercel.app/',
      external: true,
    },
    {
      title: 'Lumi',
      description:
        'A minimal, chat-based productivity app for tasks, notes, reflections, and habits.',
      href:
        'https://play.google.com/store/apps/details?id=com.lumi.mobile&pcampaignid=web_share',
      external: true,
    },
  ];

  return (
    <main className='flex justify-center xl:px-40 2xl:px-60'>
      <div className='min-w-full md:container md:mt-2 px-8  md:px-28 lg:px-60 xl:px-120'>

        {/* Present */}
        <div>
          <section>
            <div className='flex flex-row items-center justify-between'>
              <p className="text-3xl md:text-4xl font-extralight py-4">Present</p>
              {/* <Image 
                src="/selfie.png" 
                alt='TaraT' 
                width={62} 
                height={62} 
                className='h-12 md:h-16 rounded-full w-auto'
                priority={true}
              /> */}
            </div>
            <section className="text-slate-400 leading-8 text-xl md:leading-10 mt-4 font-light">
              <p>Tarat is currently shipping {" "}
                <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <Link href="https://s2.spectrum.adobe.com/index.html" target="_blank">Spectrum 2 @Adobe</Link>
                </span> {" "} but also, he is daily shitposting on X @ {" "}
                <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <Link href="https://x.com/tarat_211" target="_blank">tarat_211</Link>
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
          <p className="text-3xl md:text-4xl font-extralight py-6 pt-10">Featured Experiments</p>

          <section className="mt-2 mb-6 space-y-1 xl:pr-24">
            {featured.map((item) => (
              item.external ? (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                  aria-label={`${item.title} — open link`}
                >
                  <article className="py-4 border-b border-slate-700/60 hover:border-slate-200/60 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl text-slate-200 group-hover:text-white transition-colors">{item.title}</h3>
                        <p className="text-slate-400 text-sm md:text-base mt-1 group-hover:text-slate-300 transition-colors">{item.description}</p>
                      </div>
                      <span className="text-slate-500 group-hover:text-slate-300 transition-all transform group-hover:translate-x-1 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </a>
              ) : (
                <Link key={item.title} href={item.href} className="block group" aria-label={`${item.title} — open link`}>
                  <article className="py-4 border-b border-slate-700/60 hover:border-slate-200/60 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl text-slate-200 group-hover:text-white transition-colors">{item.title}</h3>
                        <p className="text-slate-400 text-sm md:text-base mt-1 group-hover:text-slate-300 transition-colors">{item.description}</p>
                      </div>
                      <span className="text-slate-500 group-hover:text-slate-300 transition-all transform group-hover:translate-x-1 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </Link>
              )
            ))}
          </section>
      
          {/* <div className="flex flex-col md:flex-row justify-between items-start">
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
          </div> */}

          {/* Footer */}
          <section className="py-8 flex flex-col gap-4 items-start">
            <a href="https://www.buymeacoffee.com/taratdev" target="_blank" className='text-slate-400'>Buy me a coffee ☕️</a>
          </section>
        </div>
      </div>
    </main >
  );
}
