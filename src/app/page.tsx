/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import projectdata from './projects/projects.json';
import hobbiesdata from './hobbies/hobbies.json';
import readingdata from './reading/books.json';
import writingdata from './writing/blogs.json';

import './hobbies/hobbies.css';
import './projects/projects.css';

import { getLatestTracks } from '@/utils/musicAPI';

export default async function Home() {

  const projects = projectdata['projects'];
  const hobbies = hobbiesdata['hobbies'];
  const reading = readingdata['books'];
  const writing = writingdata['blogs'];

  const latestTracks = (await getLatestTracks('TaRaT_122')).slice(1, 4);


  return (
    <main className="min-h-screen py-8 px-10 md:px-48 flex flex-col xl:grid xl:grid-cols-2 gap-8">


      <div>

        <p className="text-xl lg:text-4xl leading-relaxed text-neutral-400 font-extralight">
          Hey  there, I’m <a href="https://bento.me/tarat" target="_blank" className="text-neutral-950 cursor-alias hover:border-purple-400 hover:border-b-2" >TaraT</a> 👋 Welcome to my
          digital garden 🐛
          I am currently developing
          experiences at <a href="https://www.adobe.com/" target="_blank" className="text-neutral-950 cursor-alias hover:border-indigo-400 hover:border-b-2">adobe</a>.
        </p>
        <br />
        <p className="text-xl lg:text-4xl leading-relaxed text-neutral-400 font-extralight">
          In my free time, I like to <a href="/reading" className="text-neutral-950 cursor-pointer hover:border-red-400 hover:border-b-2">read</a> books, <a href="/writing" className="cursor-pointer text-neutral-950 hover:border-green-400 hover:border-b-2">write</a> blogs, <a href="/hobbies" className="cursor-pointer text-neutral-950 hover:border-yellow-400 hover:border-b-2">run</a> 5Kms, <a href="/hobbies" className="cursor-pointer text-neutral-950 hover:border-pink-400 hover:border-b-2">play</a> piano, <a href="/projects" className="cursor-pointer text-neutral-950 hover:border-violet-400 hover:border-b-2">code</a> my new project, <a href="/hobbies" className="cursor-pointer text-neutral-950 hover:border-blue-400 hover:border-b-2">climb</a> that wall or <a href="/projects" className="cursor-pointer text-neutral-950 hover:border-fuchsia-400 hover:border-b-2">rant</a> about latest tech.
        </p>
        <br />
        <p className="text-xl lg:text-4xl leading-relaxed text-neutral-400 font-extralight">
          This is my little space on the internet where I collect all of those things together.
        </p>

      </div>


      <div>
        <a className="cursor-alias py-6 px-6 card bg-neutral-50 border rounded shadow flex flex-col justify-between" href={projects[0].link} target="_blank" rel="noopener noreferrer">

          <div className='flex flex-row justify-between items-center'>
            <p className='text-lg lg:text-xl'>{projects[0].title}</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>
          <p className="text-sm lg:text-lg text-gray-600 pt-1 mb-2">{projects[0].description}</p>

          <img src={projects[0].img} className="border-2 border-red-50 mt-3 rounded-t" alt={projects[0].title} />
        </a>
      </div>

      <div className='flex flex-col xl:col-span-2 xl:grid xl:grid-cols-8 gap-4'>

        <a className="col-span-2 cursor-alias py-6 px-6 card bg-neutral-50 border rounded shadow flex flex-col justify-between" href="https://www.last.fm/user/TaRaT_122" target="_blank" rel="noopener noreferrer">

          <div className='text-gray-600 text-sm flex flex-row justify-between items-center'>
            <p className='text-lg'>Latest Scrobbles</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>

          <div className='flex flex-col gap-4 mt-6 xl:mt-0'>
            {latestTracks.map((track: any, index: any) => (
              <div key={index} className='cursor-alias flex flex-row gap-4'>
                <img src={track.image[2]['#text']} className="max-h-12 h-full md:max-w-18 rounded-t" alt={track.name} />
                <div className='flex flex-col'>
                  <p className='text-lg'>{
                    track.name.length > 20 ? track.name.slice(0, 20) + "..." : track.name
                  }</p>

                  <p className='text-sm lg:text-sm text-gray-600'>{
                    track.artist['#text'].length > 20 ? track.artist['#text'].slice(0, 20) + "..." : track.artist['#text']
                  }</p>
                </div>
              </div>
            ))}

          </div>

        </a>


        <a className="col-span-2 cursor-alias py-6 px-6 card bg-neutral-50 border rounded shadow flex flex-col justify-between" href={writing[0].link} target="_blank" rel="noopener noreferrer">

          <div className='text-gray-600 text-sm flex flex-row justify-between items-center'>
            <div>
              <p>{writing[0].category}</p>
              <p>{writing[0].date}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>

          <div className="gap-2 flex flex-col mt-6 xl:mt-0">

            <p className="text-lg font-medium text-gray-900">{writing[0].title.length > 70 ? writing[0].title.slice(0, 70) + "..." : writing[0].title}</p>
            <p className="text-gray-600">{writing[0].description}</p>

          </div>
        </a>

        <a href={reading[0].link} target="_blank" rel="noopener noreferrer" className="cursor-alias  col-span-2 py-6 px-6 reading-card bg-neutral-50 border rounded shadow flex flex-col justify-between">

          <div className='flex flex-row justify-between items-center'>
            {reading[0].status === 'reading' && <div className='bg-yellow-200 w-20 text-center'>{reading[0].status}</div>}
            {reading[0].status === 'to read' && <div className='bg-red-200 w-20 text-center'>{reading[0].status}</div>}
            {reading[0].status === 'read' && <div className='bg-green-200 w-20 text-center'>{reading[0].status}</div>}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>

          <div className="mt-6 gap-3 flex items-end">

            <img src={reading[0].img} className="max-h-32 h-full md:max-w-52 rounded-t hover:-rotate-2" alt={reading[0].title} />

            <div className="p-4">
              <p className="text-lg font-medium text-gray-900">{reading[0].title.length > 20 ? reading[0].title.slice(0, 20) + "..." : reading[0].title}</p>
              <p className="text-gray-600">{reading[0].author}</p>
              {reading[0].rating !== "" && <p className="text-gray-600">Rating: {reading[0].rating} </p>}
            </div>
          </div>
        </a>

        <a href={reading[1].link} target="_blank" rel="noopener noreferrer" className="cursor-alias  col-span-2 py-6 px-6 reading-card bg-neutral-50 border rounded shadow flex flex-col justify-between">

          <div className='flex flex-row justify-between items-center'>
            {reading[1].status === 'reading' && <div className='bg-yellow-200 w-20 text-center'>{reading[1].status}</div>}
            {reading[1].status === 'to read' && <div className='bg-red-200 w-20 text-center'>{reading[1].status}</div>}
            {reading[1].status === 'read' && <div className='bg-green-200 w-20 text-center'>{reading[1].status}</div>}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>

          <div className="mt-6 gap-3 flex items-end">

            <img src={reading[1].img} className="max-h-32 h-full md:max-w-52 rounded-t hover:-rotate-2" alt={reading[1].title} />

            <div className="p-4">
              <p className="text-lg font-medium text-gray-900">{reading[1].title.length > 20 ? reading[1].title.slice(0, 20) + "..." : reading[1].title}</p>
              <p className="text-gray-600">{reading[1].author}</p>
              {reading[1].rating !== "" && <p className="text-gray-600">Rating: {reading[1].rating} </p>}
            </div>
          </div>
        </a>

      </div>

      <div className='my-2'>
        Made with 💛 by <a href="https://bento.me/tarat" target="_blank" className="text-neutral-950 underline cursor-alias hover:border-purple-400 hover:border-b-2" >TaraT</a>
      </div>

    </main >
  )
}
