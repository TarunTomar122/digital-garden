/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import projectdata from './projects/projects.json';
import hobbiesdata from './hobbies/hobbies.json';
import readingdata from './reading/books.json';
import writingdata from './writing/blogs.json';

import './hobbies/hobbies.css';
import './projects/projects.css';

import { getWeeklyTopSongs } from '@/utils/musicAPI';

export default async function Home() {

  const projects = projectdata['projects'];
  const hobbies = hobbiesdata['hobbies'];
  const reading = readingdata['books'];
  const writing = writingdata['blogs'];

  const weeklyTracks = (await getWeeklyTopSongs('TaRaT_122')).slice(1, 4);

  return (
    <main className="flex min-h-screen flex-col py-8 px-10 md:px-48">
      WIP...
    </main>
  )

  return (
    <main className="flex min-h-screen flex-col py-8 px-10 md:px-48">


      <div>
        <p className="text-xl lg:text-4xl leading-relaxed font-extralight">hi stranger, </p>
        <br />

        <p className="text-md lg:text-xl leading-relaxed font-extralight">
          Welcome to my digital garden 🐛. I am Tarun Tomar, a 22 year old Software Dev from India.
          My internet name is <a href="https://bento.me/tarat" target="_blank" className="text-neutral-950 cursor-alias underline font-medium" >TaraT</a> and you can find me on most of the social media platforms with the same handle.
        </p>
        <br />
        <p className="text-md lg:text-xl leading-relaxed font-extralight">
          I'm currently working on <a href="https://spectrum.adobe.com/" target="_blank" className="text-neutral-950 cursor-alias underline font-medium">Spectrum Design System</a> at Adobe.
        </p>
        <br />
        <p className="text-md lg:text-xl leading-relaxed font-extralight">
          In my free time, I like to read books, write blogs, play piano, run 5Kms, code stupid projects and rant about some new AI model or Javascript framework.
        </p>
        {/* <p className="text-md lg:text-xl leading-relaxed font-extralight">
          I did my Bachelors in Computer Science from IIT Jodhpur and during those 4 years I made a lot of random-stupid projects that you can find on my <a href="https://github.com/TarunTomar122" className='underline'>Github.</a>
          {" "}One of my less random-stupid and more recent project is this <a href="https://tarat122.substack.com/" target="_blank" className='underline'>newsletter</a> where I publish a collection of all the interesting links I find every week.
        </p> */}



      </div>

      <hr />

      <div className='flex flex-col gap-6'>

        <div>
          <p className="text-sm lg:text-lg leading-relaxed font-extralight mb-2">Recent Writings: </p>
          <ul className="list-disc list-inside">
            {writing.slice(0, 3).map((blog: any, index: any) => (
              <li key={index} className="cursor-alias">
                <a href={blog.link} target="_blank" rel="noopener noreferrer" className="text-neutral-950 underline">{blog.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm lg:text-lg leading-relaxed font-extralight mb-2">I am currently hooked to these songs: </p>
          <ul className="list-disc list-inside">
            {weeklyTracks.map((track: any, index: any) => (
              <li key={index} className="cursor-alias">
                <a href={track.url} target="_blank" rel="noopener noreferrer" className="text-neutral-950 underline">{track.name} by {track.artist['#text']}</a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className='flex flex-col xl:col-span-2 xl:grid xl:grid-cols-8 gap-4'>


        <div>
          <a className="cursor-alias py-6 px-6 card bg-neutral-50 border rounded shadow flex flex-col justify-between" href={projects[0].link} target="_blank" rel="noopener noreferrer">

            <div className='flex flex-row justify-between items-center'>
              <p className='text-lg lg:text-xl'>{projects[0].title}</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
            <p className="text-sm lg:text-lg text-gray-600 pt-1 mb-2">{projects[0].description}</p>

            <img src={projects[0].img} className="border-2 border-red-50 mt-3 rounded-t max-w-md" alt={projects[0].title} />
          </a>
        </div>

        <a className="col-span-2 cursor-alias py-6 px-6 card bg-neutral-50 border rounded shadow flex flex-col justify-between" href="https://www.last.fm/user/TaRaT_122" target="_blank" rel="noopener noreferrer">

          <div className='text-gray-600 text-sm flex flex-row justify-between items-center'>
            <p className='text-lg'>Latest Scrobbles</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>

          <div className='flex flex-col gap-4 mt-6 xl:mt-0'>
            {weeklyTracks.map((track: any, index: any) => (
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

        <a href={reading[4].link} target="_blank" rel="noopener noreferrer" className="cursor-alias  col-span-2 py-6 px-6 reading-card bg-neutral-50 border rounded shadow flex flex-col justify-between">

          <div className='flex flex-row justify-between items-center'>
            {reading[4].status === 'reading' && <div className='bg-yellow-200 w-20 text-center'>{reading[4].status}</div>}
            {reading[4].status === 'to read' && <div className='bg-red-200 w-20 text-center'>{reading[4].status}</div>}
            {reading[4].status === 'read' && <div className='bg-green-200 w-20 text-center'>{reading[4].status}</div>}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>

          <div className="mt-6 gap-3 flex items-end">

            <img src={reading[4].img} className="max-h-32 h-full md:max-w-52 rounded-t hover:-rotate-2" alt={reading[4].title} />

            <div className="p-4">
              <p className="text-lg font-medium text-gray-900">{reading[4].title.length > 20 ? reading[4].title.slice(0, 20) + "..." : reading[4].title}</p>
              <p className="text-gray-600">{reading[4].author}</p>
              {reading[4].rating !== "" && <p className="text-gray-600">Rating: {reading[4].rating} </p>}
            </div>
          </div>
        </a>

        <a href={reading[3].link} target="_blank" rel="noopener noreferrer" className="cursor-alias  col-span-2 py-6 px-6 reading-card bg-neutral-50 border rounded shadow flex flex-col justify-between">

          <div className='flex flex-row justify-between items-center'>
            {reading[3].status === 'reading' && <div className='bg-yellow-200 w-20 text-center'>{reading[3].status}</div>}
            {reading[3].status === 'to read' && <div className='bg-red-200 w-20 text-center'>{reading[3].status}</div>}
            {reading[3].status === 'read' && <div className='bg-green-200 w-20 text-center'>{reading[3].status}</div>}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>

          <div className="mt-6 gap-3 flex items-end">

            <img src={reading[3].img} className="max-h-32 h-full md:max-w-52 rounded-t hover:-rotate-2" alt={reading[3].title} />

            <div className="p-4">
              <p className="text-lg font-medium text-gray-900">{reading[3].title.length > 20 ? reading[3].title.slice(0, 20) + "..." : reading[3].title}</p>
              <p className="text-gray-600">{reading[3].author}</p>
              {reading[3].rating !== "" && <p className="text-gray-600">Rating: {reading[3].rating} </p>}
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
