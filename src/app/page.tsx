/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import readingdata from './reading/books.json';
import writingdata from './writing/blogs.json';

import './hobbies/hobbies.css';
import './projects/projects.css';

import { getWeeklyTopSongs } from '@/utils/musicAPI';

export default async function Home() {

  const reading = readingdata['books'];
  const writing = writingdata['blogs'];

  const weeklyTracks = (await getWeeklyTopSongs('TaRaT_122')).slice(1, 4);

  return (
    <main className="flex min-h-screen flex-col py-8 px-10 md:px-48">


      <div className='flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-12'>

        <div className='col-span-2'>
          <p className="text-2xl lg:text-5xl leading-relaxed font-extralight">hi stranger, </p>
          <br />

          <p className="text-lg lg:text-2xl leading-relaxed font-extralight">
            Welcome to my digital garden 🐛. </p>

          <br />
          <p className="text-lg lg:text-2xl leading-relaxed font-extralight">
            I am <a href="https://bento.me/tarat" target="_blank" className="text-blue-500 cursor-alias underline font-medium" >TaraT</a>, a 22 year old Software Developer from India.
          </p>
          <br />
          <p className="text-lg lg:text-2xl leading-relaxed font-extralight">
            I'm currently working on <a href="https://spectrum.adobe.com/" target="_blank" className="text-red-500 cursor-alias underline font-medium">Spectrum Design System</a> at Adobe.
          </p>
          <br />
          <p className="text-lg lg:text-2xl leading-relaxed font-extralight">
            In my free time, I like to read books, write blogs, play piano, run a few Kms, code stupid projects and rant about some new AI model or Javascript framework.
          </p>
        </div>

        <div className='col-span-1'>
          <img src="./assets/profile.png" className="h-full md:max-w-96 rounded-t" alt="hero" />
        </div>

      </div>

      <br />
      <hr />
      <br />

      <div className='flex flex-col lg:grid lg:grid-cols-3 gap-8 md:gap-12 lg:gap-48'>

        <div className='col-span-1'>
          <div className='text-sm flex flex-row justify-between items-center'>
            <p className='text-xl lg:text-2xl leading-relaxed font-extralight'>This week I'm obsessed with:</p>
          </div>
          <div className='flex flex-col gap-4 mt-6 xl:mt-6'>
            {weeklyTracks.map((track: any, index: any) => (
              <div key={index} className='cursor-alias flex flex-row gap-4'>
                <img src={track.image[2]['#text']} className="max-h-12 h-full md:max-w-18 rounded-t" alt={track.name} />
                <div className='flex flex-col'>
                  <p className='text-lg'>{
                    track.name.length > 20 ? track.name.slice(0, 30) + "..." : track.name
                  }</p>

                  <p className='text-sm lg:text-sm text-gray-600'>{
                    track.artist['#text'].length > 20 ? track.artist['#text'].slice(0, 20) + "..." : track.artist['#text']
                  }</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <a className='col-span-1 flex flex-col justify-between' href={writing[0].link} target="_blank">
          <div className='text-sm flex flex-row justify-between items-center'>
            <p className='text-xl lg:text-2xl leading-relaxed font-extralight'>I recently wrote:</p>
          </div>
          <div className='flex flex-col gap-4 mt-6 xl:mt-6'>
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

              <p className="text-xl font-medium text-gray-900">{writing[0].title.length > 70 ? writing[0].title.slice(0, 70) + "..." : writing[0].title}</p>
              <p className="text-gray-600">{writing[0].description}</p>

            </div>
          </div>
        </a>

        <div className='col-span-1 flex flex-col justify-between'>
          <div className='text-sm flex flex-row justify-between items-center'>
            <p className='text-xl lg:text-2xl leading-relaxed font-extralight'>I am currently reading:</p>
          </div>
          <div className='flex flex-col gap-4 mt-6 xl:mt-6'>
            <a href={reading[3].link} target="_blank" rel="noopener noreferrer" className="cursor-alias  col-span-2 flex flex-col justify-between">
              <div className="mt-4 gap-3 flex items-end">

                <img src={reading[3].img} className="max-h-32 h-full md:max-w-52 rounded-t hover:-rotate-2" alt={reading[3].title} />

                <div className="p-4">
                  <p className="text-lg font-medium text-gray-900">{reading[3].title.length > 20 ? reading[3].title.slice(0, 20) + "..." : reading[3].title}</p>
                  <p className="text-gray-600">{reading[3].author}</p>
                  {reading[3].rating !== "" && <p className="text-gray-600">Rating: {reading[3].rating} </p>}
                </div>
              </div>
            </a>
          </div>
        </div>

      </div>

      <br />
      <br />
      <hr />

      <div className='my-2 mt-8'>
        Made with 💛 by <a href="https://bento.me/tarat" target="_blank" className="text-neutral-950 underline cursor-alias hover:border-purple-400 hover:border-b-2" >TaraT</a>
      </div>

    </main >
  )
}
