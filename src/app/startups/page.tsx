/* eslint-disable @next/next/no-img-element */
import readingdata from '../reading/books.json'
import writingdata from '../writing/blogs.json'
import '../hobbies/hobbies.css'
import '../projects/projects.css'

import { getWeeklyTopSongs } from '@/utils/musicAPI'
import { getStartupMetrics } from '@/utils/posthogAPI'
import StartupCard from './StartupCard'
import SimpleBarChart from '@/components/SimpleBarChart'

const startups = [
  {
    name: 'tikrr.online',
    tagline: 'Event discovery, simplified.',
    link: 'https://tikrr.online',
    color: '#f87171',
  },
  {
    name: 'yourtrace.online',
    tagline: 'Track what matters.',
    link: 'https://yourtrace.online',
    color: '#38bdf8',
  },
]

export default async function Page() {
  const reading = readingdata['books']
  const writing = writingdata['blogs']
  const weeklyTracks = (await getWeeklyTopSongs('TaRaT_122')).slice(1, 4)

  const [tikrrData, yourtraceData] = await Promise.all([
    getStartupMetrics('tikrr.online'),
    getStartupMetrics('yourtrace.online'),
  ])

  return (
    <main className="flex min-h-screen flex-col py-8 px-10 md:px-48">
      <p className="text-3xl lg:text-6xl font-normal leading-relaxed">
        my startups.
      </p>
      <p className="text-neutral-500 text-lg lg:text-xl font-light mb-8">
        building stuff, one stupid idea at a time.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-auto">
        <div className="col-span-1 lg:col-span-2 row-span-1">
          <StartupCard
            name={startups[0].name}
            tagline={startups[0].tagline}
            link={startups[0].link}
            color={startups[0].color}
            data={tikrrData}
          />
        </div>

        <div className="col-span-1 row-span-1">
          <StartupCard
            name={startups[1].name}
            tagline={startups[1].tagline}
            link={startups[1].link}
            color={startups[1].color}
            data={yourtraceData}
          />
        </div>

        <div className="col-span-1 row-span-1">
          <div className="card bg-neutral-50 border rounded shadow p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-lg lg:text-xl font-medium">
                This week I&apos;m obsessed with
              </p>
              <span className="text-xl">🎵</span>
            </div>
            <div className="flex flex-col gap-3 flex-1 justify-center">
              {weeklyTracks.map((track: any, index: number) => (
                <div key={index} className="flex flex-row gap-3 items-center">
                  <img
                    src={track.image[2]['#text']}
                    className="h-10 w-10 rounded"
                    alt={track.name}
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm truncate">
                      {track.name.length > 25
                        ? track.name.slice(0, 25) + '...'
                        : track.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {track.artist['#text'].length > 20
                        ? track.artist['#text'].slice(0, 20) + '...'
                        : track.artist['#text']}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 row-span-1">
          <a
            href={writing[0].link}
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-neutral-50 border rounded shadow p-6 h-full flex flex-col cursor-alias"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-lg lg:text-xl font-medium">
                Latest writing
              </p>
              <span className="text-xl">📝</span>
            </div>
            <div className="flex flex-col gap-2 flex-1 justify-center">
              <p className="text-xs text-gray-500">
                {writing[0].category} &middot; {writing[0].date}
              </p>
              <p className="text-base font-medium">
                {writing[0].title.length > 50
                  ? writing[0].title.slice(0, 50) + '...'
                  : writing[0].title}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {writing[0].description}
              </p>
            </div>
          </a>
        </div>

        <div className="col-span-1 row-span-1">
          <a
            href={reading[0].link}
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-neutral-50 border rounded shadow p-6 h-full flex flex-col cursor-alias"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-lg lg:text-xl font-medium">
                Currently reading
              </p>
              <span className="text-xl">📚</span>
            </div>
            <div className="flex items-center gap-4 flex-1">
              <img
                src={reading[0].img}
                className="h-24 w-auto rounded shadow-sm hover:-rotate-2 transition-transform"
                alt={reading[0].title}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">
                  {reading[0].title.length > 20
                    ? reading[0].title.slice(0, 20) + '...'
                    : reading[0].title}
                </p>
                <p className="text-xs text-gray-500">{reading[0].author}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </main>
  )
}
